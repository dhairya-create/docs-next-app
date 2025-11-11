"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon } from "lucide-react";
import { useRef, useState } from "react";

import { useSearchparam } from "@/hooks/useSearchParam";

export const SearchInput = () => {
 
  const [search, setSearch] = useSearchparam();
   const [value, setValue] = useState(search);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleClear = () => {
    setValue("");
    setSearch("")
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearch(value)
    inputRef.current?.blur();
  };

  return (
    <div className="flex-1 flex items-center justify-center">
      <form className="relative max-w-[720px] w-full"
      onSubmit={handleSubmit}
      >
    
        <Input
          placeholder="Search"
          className="md:text-base placeholder:text-neutral-800 px-14 w-full border-none
         focus-visible:shadow-[0_1px_1px_0_rgba(65,69,73,.3),0_1px_3px_1px_rgba(65,69,73,.15)]
         bg-[#F0F4F8] rounded-full h-[48px] focus-visible:ring-0 focus:bg-white
         "
          value={value}
          onChange={handleChange}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute left-3 top-1/2 -translate-y-1/2 [&svg]:size-5 rounded-full"
        >
          <SearchIcon />
        </Button>
        {value && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-3 top-1/2 -translate-y-1/2 [&_svg]:size-5 rounded-full"
            onClick={handleClear}
          >
            <XIcon />
          </Button>
        )}
      </form>
    </div>
  );
};
