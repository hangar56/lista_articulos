import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductCatalog = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScale, setSelectedScale] = useState('all');

  const products = [
    { name: 'Set conversión A-4AR Trumpeter (Incl. rueda nariz)', scale: '1/32', price: 41000, item: '32430' },
    { name: 'Rueda Delantera A-4 Trumpeter', scale: '1/32', price: 4900, item: '32465' },
    { name: 'Nariz Dagger Italeri', scale: '1/32', price: 8500, item: '32251' },
    { name: 'Nariz Finger Italeri', scale: '1/32', price: 8500, item: '32256' },
    { name: 'Petalos Toberas Italeri', scale: '1/32', price: 8700, item: '32211' },
    { name: 'BR-250 Esc 1/32 (4u.)', scale: '1/32', price: 11000, item: '32060' },
    { name: 'Bombas Mk-17 1000lbs Esc 1/48(4u.)', scale: '1/48', price: 7900, item: '48010' },
    { name: 'Snakeye 1/48 (4u.)', scale: '1/48', price: 7900, item: '48021' },
    { name: 'BR-250 Esc 1/48 (4u.)', scale: '1/48', price: 7900, item: '48040' },
    { name: 'MK-77 (3)', scale: '1/48', price: 5900, item: '48055' },
    { name: 'Bombas Mk-17 1000lbs Esc 1/72 (4u.)', scale: '1/72', price: 7100, item: '72002' },
    { name: 'Snakeye 1/72 (4u.)', scale: '1/72', price: 7100, item: '72020' },
    { name: 'BR-250 Esc 1/72 (4u.)', scale: '1/72', price: 7100, item: '72030' },
  ];

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedScale === 'all' || product.scale === selectedScale)
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Hangar 56 Product Catalog</h1>
      <div className="flex mb-4 space-x-4">
        <Input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-grow"
        />
        <Select value={selectedScale} onValueChange={setSelectedScale}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select scale" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Scales</SelectItem>
            <SelectItem value="1/32">1/32</SelectItem>
            <SelectItem value="1/48">1/48</SelectItem>
            <SelectItem value="1/72">1/72</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Item</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Scale</TableHead>
            <TableHead>Price (ARS)</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.map((product) => (
            <TableRow key={product.item}>
              <TableCell>{product.item}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{product.scale}</TableCell>
              <TableCell>{product.price.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ProductCatalog;