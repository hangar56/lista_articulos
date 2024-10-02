import csv
import html
import sys

def csv_to_html_table_rows(csv_file_path, output_file_path):
    html_rows = []
    image_counter = 1
    
    with open(csv_file_path, 'r', newline='', encoding='utf-8') as file:
        csv_reader = csv.reader(file)
        
        for row in csv_reader:
            if all(cell.strip() == '' for cell in row):
                # Empty row
                html_rows.append('<tr><td colspan="7">&nbsp;</td></tr>')
            else:
                html_row = '<tr>'
                for i, cell in enumerate(row[:7]):  # Process only the first 7 fields
                    escaped_cell = html.escape(cell.strip())
                    if i == 6 and escaped_cell:  # 7th field (index 6)
                        # Replace content with image
                        html_row += f'<td><img src="images/image_{image_counter}.jpeg" alt="{escaped_cell}" class="thumbnail" /></td>'
                        image_counter += 1
                    else:
                        html_row += f'<td>{escaped_cell}</td>'
                
                html_row += '</tr>'
                html_rows.append(html_row)
    
    # Write the output to the specified file
    with open(output_file_path, 'w', encoding='utf-8') as output_file:
        output_file.write('\n'.join(html_rows))

# Check if correct number of command-line arguments is provided
if len(sys.argv) != 3:
    print("Usage: python script.py <input_csv_file> <output_html_file>")
    sys.exit(1)

input_csv_file = sys.argv[1]
output_html_file = sys.argv[2]

csv_to_html_table_rows(input_csv_file, output_html_file)
print(f"HTML table rows have been written to {output_html_file}")