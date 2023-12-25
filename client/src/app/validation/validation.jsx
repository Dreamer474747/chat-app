import * as yup from "yup";


export const signUpSchema = yup.object().shape({
	username: yup
	.string()
	.required("please enter you're user name")
	.min(1, "1 character at least")
	.max(10, "10 characters only"),
	id: yup
	.string()
	.required("please enter you're user id")
	.test("no-spaces", "spaces are not allowed", value => {
      return value && !/\s/.test(value);
    })
	.matches(/^[A-Za-z][A-Za-z0-9\._-]*$/, "english letters and numbers only, start with a letter")
	.min(7, "7 character at least")
	.max(15, "15 character only"),
	password: yup
	.string()
	.required("please enter you're password")
	.test("no-spaces", "spaces are not allowed", value => {
      return value && !/\s/.test(value);
    })
	.matches(/^[A-Za-z]?[A-Za-z0-9\._-]*$/, "english letters and numbers only, start with a letter")
	.min(7, "7 character at least")
	.max(15, "15 character only"),
})

export const signInSchema = yup.object().shape({
	id: yup
	.string()
	.required("please enter you're user id")
	.test("no-spaces", "spaces are not allowed", value => {
      return value && !/\s/.test(value);
    })
	.matches(/^[A-Za-z][A-Za-z0-9\._-]*$/, "english letters and numbers only, start with a letter")
	.min(7, "7 character at least")
	.max(15, "15 character only"),
	password: yup
	.string()
	.required("please enter you're password")
	.test("no-spaces", "spaces are not allowed", value => {
      return value && !/\s/.test(value);
    })
	.matches(/^[A-Za-z]?[A-Za-z0-9\._-]*$/, "english letters and numbers only, start with a letter")
	.min(7, "7 character at least")
	.max(15, "15 character only"),
})
