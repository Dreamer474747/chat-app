
const SystemMsg = ({ body }: { body: string }) => {
	
	return (
		<div className="mt-2 m-auto w-fit">
			<h5 className="text-slate-300 px-4 py-1 border rounded-sm text-xs sm:text-base">{body}</h5>
		</div>
	)
}

export default SystemMsg;