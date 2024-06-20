"use client";
import { useState, useContext, useEffect } from "react";

import { WebsocketContext } from "c/WebsocketProvider";
import type { WebsocketContextType } from "u/types";

import { useToast } from "ui/useToast";
import { idRegex } from "u/constants";

import { Button } from "ui/Button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "ui/Dialog";
import { Input } from "ui/Input"
import { Label } from "ui/Label"



const Create = () => {
	
	const { socket } = useContext(WebsocketContext) as WebsocketContextType;
	const { toast } = useToast();
	
	const [open, setOpen] = useState(false);
	const [name, setName] = useState("");
	const [id, setId] = useState("");
	
	useEffect(() => {
		
		if (!open) {
			setName("");
			setId("");
		}
	}, [open])
	
	
	const create = async () => {
		
		if (!name.trim()) {
			
			return toast({
				variant: "destructive",
				title: "name input is empty",
			})
			
		} else if (name.length > 12) {
			return toast({
				variant: "destructive",
				title: "Stop it right there!!!",
				description: "a group name cant be more than 12 characters",
			})
			
		} else if (!id.trim()) {
			
			return toast({
				variant: "destructive",
				title: "id input is empty",
			})
			
		} else if (id.length < 5) {
			return toast({
				variant: "destructive",
				title: "id length is not enough",
				description: "the id input must atleast contain 5 characters",
			})
		} else if (id.length > 15) {
			return toast({
				variant: "destructive",
				title: "Stop it right there!!!",
				description: "a group id cant be more than 15 characters",
			})
		}
		
		const isIdValid = id.match(idRegex);
		if (!isIdValid) {
			
			return toast({
				variant: "destructive",
				title: "group id is not valid",
				description: `you can only use "_", "-" or "." special characters and the id cant
				be started with a number and it cant have spaces`,
			})
		}
		
		const res = await fetch("/api/create/group", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({ name, id })
		})
		
		
		
		if (res.status === 201) {
			
			const { newGroup } = await res.json();
			socket.emit("createNewChat", newGroup);
			
			setOpen(false);
			toast({
				variant: "success",
				title: "group created successfully :))",
			})
		
		} else if (res.status === 500) {
			toast({
				variant: "destructive",
				title: "there was a problem, try again",
			})
		
		} else if (res.status === 409) {
			toast({
				variant: "destructive",
				title: "id is already in use",
			})
			
		} else { // (res.status === 422)
			// i dont know if someone can actually get a 422 status code response from client side,
			// but that "(⌐■_■)" looks cool af.
			toast({
				variant: "destructive",
				title: "youre onto something(⌐■_■)",
			})
		}
	}
	
	
	
	
	return (
		<Dialog open={open} onOpenChange={setOpen}>
		
			<DialogTrigger asChild>
				<Button variant="outline" className="fill-white bg-primary hover:bg-primary-hover">
					<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z"/></svg>
				</Button>
			</DialogTrigger>
			
			<DialogContent className="sm:max-w-[425px] bg-secondary text-white">
			
				<DialogHeader>
					
					<DialogTitle className="">
						Create a new group
					</DialogTitle>
					
					<DialogDescription className="text-white">
						type the name and the id of the new group
					</DialogDescription>
					
				</DialogHeader>
				
				<div className="grid gap-4 py-4">
					
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="name" className="text-right">
							Name
						</Label>
						<Input
							id="name"
							placeholder="Name"
							className="col-span-3 text-white bg-primary"
							defaultValue={name}
							onChange={(e) => setName(e.target.value)}
						/>
					</div>
					
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="id" className="text-right">
							Id
						</Label>
						<Input
							id="id"
							placeholder="Id"
							className="col-span-3 text-white bg-primary"
							defaultValue={id}
							onChange={(e) => setId(e.target.value)}
						/>
					</div>
					
				</div>
				
				<DialogFooter>
					<Button
						onClick={create}
						className="mx-auto bg-primary hover:bg-primary-hover"
					>Create</Button>
				</DialogFooter>
				
			</DialogContent>
			
		</Dialog>
	)
}

export default Create;