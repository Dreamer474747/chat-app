const colors = [
	"#00c853",
	"#03a9f4",
	"#3f51b5",
	"#009688",
	"#00b0ff",
	"#1de9b6",
	"#00e676",
	"#ffc400",
	"#00bcd4",
	"#ffab00"
]

const colorPicker = index => {
	if (index < 9) {
		return colors[index];
	} else if (index > 9 && index < 18) {
		return colors[index - 9];
	} else {
		return colors[index - 18];
	}
}

export default colorPicker;