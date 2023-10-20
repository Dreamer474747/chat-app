import { format } from "date-fns";
import { utcToZonedTime } from "date-fns-tz";








const monthes = [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" ]
	
const timeZone = "Asia/Tehran";


const timeConverter = (time) => {
	
	const zonedDate = utcToZonedTime(new Date(time), timeZone)
	
	const currentMonth = zonedDate.getMonth();
	const currentDayOfTheMonth = zonedDate.getDate();
	
	const formattedTime = format(zonedDate, "hh:mma");
	
	const formattedDate = `${(currentDayOfTheMonth)} ${monthes[currentMonth]}, ${formattedTime}`;
	
	return formattedDate;
}


export default timeConverter;