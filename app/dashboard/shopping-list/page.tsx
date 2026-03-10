"use client";

import { TypographyH2, TypographyP } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { FileSpreadsheet, Sparkles, Plus } from "lucide-react";

export default function ShoppingListPage() {
  return (
    <div className="flex flex-1 flex-col @container/main gap-6">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pt-4 md:pt-10 lg:pt-20">
        <div className="flex flex-col">
          <TypographyH2>Shopping List</TypographyH2>
          <TypographyP className="text-muted-foreground text-sm">
            Manage your upcoming grocery run.
          </TypographyP>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="text-primary hover:text-primary hover:bg-primary/20 bg-primary/10 border-transparent shadow-none"
          >
            <FileSpreadsheet className="size-4 mr-2" />
            Import CSV
          </Button>
          <Button 
            className="bg-gradient-to-r from-primary to-emerald-500 hover:opacity-90 text-primary-foreground border-transparent border-0 shadow-none transition-opacity"
          >
            <Sparkles className="size-4 mr-2" />
            Generate AI List
          </Button>
        </div>
      </div>

      {/* Add Item Toolbar */}
      <div className="flex flex-col sm:flex-row items-center gap-2 p-2 border rounded-xl bg-card shadow-sm">
        
        <div className="relative flex-1 w-full flex items-center">
          <Plus className="absolute left-3 size-4 text-muted-foreground" />
          <Input 
            placeholder="Add item manually (e.g. 'Avocados')..." 
            className="pl-9 border-none shadow-none focus-visible:ring-0 bg-transparent"
          />
        </div>

        <Separator orientation="vertical" className="hidden sm:block h-8 opacity-50" />

        <div className="flex w-full sm:w-auto items-center gap-2 shrink-0">
          <Select defaultValue="produce" >
            <SelectTrigger className="w-full sm:w-[130px] border-none shadow-none focus:ring-0 bg-transparent text-muted-foreground">
              <SelectValue placeholder="Category" />
            </SelectTrigger >
            <SelectContent align="start" position="popper" side="bottom">
              <SelectItem value="Produce">Produce</SelectItem>
              <SelectItem value="Dairy & Eggs">Dairy & Eggs</SelectItem>
              <SelectItem value="Meat & Seafood">Meat & Seafood</SelectItem>
              <SelectItem value="Bread & Grains">Bread & Grains</SelectItem>
              <SelectItem value="Pantry">Pantry</SelectItem>
              <SelectItem value="Frozen">Frozen</SelectItem>
              <SelectItem value="Snacks & Beverages">Snacks & Beverages</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
          
          <Button className=" w-auto  bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
            Add Item
          </Button>
        </div>
      </div>

    </div>
  );
}