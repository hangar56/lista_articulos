import csv
import sqlite3
import argparse
import sys

def import_csv_to_sqlite(csv_file_path, db_file_path):
    try:
        # Connect to the SQLite database
        conn = sqlite3.connect(db_file_path)
        cursor = conn.cursor()

        # Open and read the CSV file
        with open(csv_file_path, 'r') as csv_file:
            csv_reader = csv.reader(csv_file)
            
            for row in csv_reader:
                # Ignore empty lines
                if all(cell.strip() == '' for cell in row):
                    continue
                
                # Take only the first 6 columns (1-based indexing)
                row = row[:6]
                
                # If there are less than 6 columns, pad with None
                while len(row) < 6:
                    row.append(None)
                
                # Insert the row into the database
                cursor.execute('''
                    INSERT INTO articulos (cat1, cat2, descripcion, item, escala, precio)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', row)

        # Commit the changes and close the connection
        conn.commit()
        conn.close()
        print("Data imported successfully.")
    except sqlite3.Error as e:
        print(f"An error occurred with the database: {e}")
    except IOError as e:
        print(f"An error occurred while reading the CSV file: {e}")
    except Exception as e:
        print(f"An unexpected error occurred: {e}")

def main():
    parser = argparse.ArgumentParser(description='Import CSV data to SQLite database.')
    parser.add_argument('csv_file', help='Path to the input CSV file')
    parser.add_argument('db_file', help='Path to the SQLite database file')
    
    args = parser.parse_args()
    
    import_csv_to_sqlite(args.csv_file, args.db_file)

if __name__ == "__main__":
    main()
