"use client";
import { useState, useContext, useEffect } from "react";

import { CurrentChatContext } from "c/CurrentChatProvider";
import type { CurrentChatContextType, SearchResult } from "u/types";

import { Button } from "ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "ui/Dialog";
import { Input } from "ui/Input";
import { Label } from "ui/Label";
import { RadioGroup, RadioGroupItem } from "ui/RadioGroup";
import { ToggleGroup, ToggleGroupItem } from "ui/ToggleGroup";
import { Avatar, AvatarFallback } from "ui/Avatar";
import { Separator } from "ui/Separator";

import { idRegex } from "u/constants";
import { useToast } from "ui/useToast";




const Search = () => {
	
	const { toast } = useToast();
	
	const { updateName, updateRole, updateChatId, updateChatType, updateChatmateId
	} = useContext(CurrentChatContext) as CurrentChatContextType;
	
	const [target, setTarget] = useState("user");
	const [open, setOpen] = useState(false);
	const [searchItems, setSearchItems] = useState<SearchResult[]>([]);
	const [searchValue, setSearchValue] = useState("");
	
	useEffect(() => {
		
		if (!open) {
			setTarget("user");
			setSearchItems([]);
			setSearchValue("");
		}
		
	}, [open])
	
	const search = async () => {
		
		if (searchValue.length < 5) {
			return toast({
				variant: "destructive",
				title: "id must be atleast 5 characters",
			})
		}
		
		const isIdValid = searchValue.match(idRegex);
		if (!isIdValid) {
			
			return toast({
				variant: "destructive",
				title: "id is not valid",
				description: `an id can only have "_", "-" or "." as a special character and an id cant
				be started with a number and it cant have spaces`,
			})
		}
		
		const res = await fetch(`/api/search/${target}/${searchValue}`)
		
		if (res.status === 200) {
			const { results } = await res.json();
			setSearchItems(results);
			
		} else if (res.status === 404) {
			const { message } = await res.json();
			toast({
				variant: "destructive",
				title: message
			})
			
		} else if (res.status === 301) {
			toast({
				variant: "destructive",
				title: `there were some ${target} ids similar to the given id, but you already
				${ target === "user" ? "had those users as a contact" : "were a member of those groups" }`
			})
			
		} else if (res.status === 500) {
			toast({
				variant: "destructive",
				title: "there was a problem, try again",
			})
		}
		
	}
	
	
	
	const openChatPage = (_id: string, name: string) => {
		// '_id' in here is either a user's _id or a group chat's _id.
		// 'name' in here is either a group chat's name or a chat partner's name.
		updateRole("OBSERVER");
		updateName(name);
		
		if (target === "user") {
			// if target is "user", then '_id' is a user's _id.
			updateChatType("private");
			updateChatId("");
			updateChatmateId(_id);
		
		} else { // target === "group"
			// if target is "group", then '_id' is a group chat's _id.
			updateChatType("group");
			updateChatId(_id);
			updateChatmateId("");
		}
		
		setOpen(false);
	}
	
	
	
	return (
		<Dialog open={open} onOpenChange={setOpen}>
		
			<DialogTrigger asChild>
				<Button variant="outline" className="fill-white bg-primary hover:bg-primary-hover">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>
				</Button>
			</DialogTrigger>
			
			<DialogContent className="sm:max-w-[425px] bg-secondary text-white">
			
				<DialogHeader>
					
					<DialogTitle className="">
						Search for new contacts and groups
					</DialogTitle>
					
					<DialogDescription className="text-white">
						type the id of the new contact or group
					</DialogDescription>
					
				</DialogHeader>
				
				<div className="grid gap-4 py-4">
					
					<div className="flex justify-center items-start">
						
						<Label className="mr-3" >
							Search for a:
						</Label>
						
						<RadioGroup
							defaultValue="user"
							onValueChange={(value) => setTarget(value)}
							className="flex"
						>
							
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="user" id="r1"
									className="bg-white custom-dot-color"
								/>
								<Label htmlFor="r1">User</Label>
							</div>
							
							<div className="flex items-center space-x-2">
								<RadioGroupItem
									value="group" id="r2"
									className="bg-white color-[red] custom-dot-color"
								/>
								<Label htmlFor="r2">Group</Label>
							</div>
						
						</RadioGroup>
					
					</div>
					
					<div className="grid grid-cols-4 items-center gap-3">
					
						<Label htmlFor="id" className="text-right">
							{target ? `${target}'s id` : "id"}
						</Label>
						
						<Input
							id="id"
							className="col-span-3 bg-primary"
							placeholder={target ? `${target}'s id` : "id"}
							defaultValue={searchValue}
							onChange={(e) => setSearchValue(e.target.value)}
						/>
					
					</div>
					
					
					<ToggleGroup
						type="single"
						className="flex flex-col items-start pr-10 pl-16"
					>
						{
							searchItems.length > 0 && searchItems?.map((search) => (
								
									<ToggleGroupItem
										key={search.id}
										value={search.name}
										aria-label={`Toggle ${search.name}`}
										className="px-4 py-8 mb-1 cursor-pointer flex justify-start w-full bg-primary hover:bg-primary-hover hover:text-white"
										onClick={() => openChatPage(search._id, search.name)}
									>
										<Avatar>
											<AvatarFallback className="avatar">
												{search.name[0]}
											</AvatarFallback>
										</Avatar>
										
										<div className="flex flex-col items-start ml-2">
											<h3 className="text-xl">{search.name}</h3>
											<p>@{search.id}</p>
										</div>
									</ToggleGroupItem>
							))
						}
					</ToggleGroup>
					
				</div>
				
				<DialogFooter>
					<Button
						onClick={search}
						className="bg-primary hover:bg-primary-hover mx-auto"
					>Search</Button>
				</DialogFooter>
				
			</DialogContent>
			
		</Dialog>
	)
}

export default Search;