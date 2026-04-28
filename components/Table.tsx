import React from "react";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";

export default function MyTable({vendors}) {
  return (
    <Table aria-label="Example static collection table mx-auto">
      <TableHeader>
        {/* <TableColumn>NAME</TableColumn> */}
        <TableColumn>PHONE</TableColumn>
        <TableColumn>CART</TableColumn>
        <TableColumn>CREADTED AT</TableColumn>
      </TableHeader>
      <TableBody>
        {(vendors) ? 
          vendors.map((item) => {
            return (
              <TableRow key={item._id}>
              {/* <TableCell>{item._id}</TableCell> */}
              <TableCell>{item.phone}</TableCell>
              <TableCell>{item.cart.length}</TableCell>
              <TableCell>{item.createdAt}</TableCell>
            </TableRow>
            )
          }) : null
        }
       
        
      </TableBody>
    </Table>
  );
}
