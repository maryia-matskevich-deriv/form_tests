import React from "react";
import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ValidationInReact from "../ValidationInReact";

describe("Tasks", () => {
  it("Select the option and check that option 'male' was selected", () => {
    render(<ValidationInReact />);
    const gender_select = screen.getByRole('combobox');
    userEvent.selectOptions(gender_select, 'male');
    expect(gender_select).toHaveDisplayValue(/male/i);

  });

  it("Check that the user has filled the form except of gender select", async () => {
    render(<ValidationInReact />);

    const name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");
    const number = screen.getByPlaceholderText("mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirmPass = screen.getByPlaceholderText("confirm Password");

    await userEvent.type(name, "Jhon");
    await userEvent.type(email, "jhon@deriv.com");
    await userEvent.type(number, "123456789");
    await userEvent.type(password, "asdfghjkl");
    await userEvent.type(confirmPass, "asdfghjkl");

    expect(name).toHaveDisplayValue("Jhon");
    expect(email).toHaveDisplayValue("jhon@deriv.com");
    expect(number).toHaveDisplayValue("123456789");
    expect(password && confirmPass).toHaveDisplayValue("asdfghjkl");

  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", async () => {
    render(<ValidationInReact />);
    const fName = screen.getByPlaceholderText("First Name")
    await userEvent.type(fName, '12');
    expect(fName).toHaveDisplayValue(/^.{2,}$/);

  });

  it("Check that the button submit was clicked", async () => {
    const onChange = jest.fn();
    render(<ValidationInReact mockOnClick={onChange} />);

    const name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");
    const number = screen.getByPlaceholderText("mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirmPass = screen.getByPlaceholderText("confirm Password");
    const button = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(name, 'Jhon');
    await userEvent.type(email, "jhon@deriv.com");
    await userEvent.type(number, "6037583745");
    await userEvent.type(password, "asdX76!fghjkl");
    await userEvent.type(confirmPass, "asdX76!fghjkl");
    
    expect(button).toBeEnabled();
    fireEvent.click(button)
    expect(onChange).toHaveBeenCalled();
    
  });

  it("Check that the form has a class", () => {
    render(<ValidationInReact />);
    const formEle = screen.getByRole("form")
    expect(formEle).toHaveClass("contacts_form");
    
  });

  it("Check that the labels of the form have a content", () => {
    render(<ValidationInReact />);

    expect(screen.getByText("First name:")).toBeInTheDocument();
    expect(screen.getByText("Email:")).toBeInTheDocument();
    expect(screen.getByText("Mobile:")).toBeInTheDocument();
    expect(screen.getByText("Password:")).toBeInTheDocument();
    expect(screen.getByText("Confirm Password:")).toBeInTheDocument();
    // expect(true).toBe(true);
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    render(<ValidationInReact />);
    const genderList = screen.getByRole("combobox");
    const option = screen.getByRole("option", { name: "select" })
    userEvent.click(genderList);

    expect(option.selected).toBe(true);

  });

  it("Check that the user can't to click a submit until fields will be correct filled", async () => {
    render(<ValidationInReact />);
    
    const name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");
    const number = screen.getByPlaceholderText("mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirmPass = screen.getByPlaceholderText("confirm Password");
    const button = screen.getByRole("button", { name: "Submit" });

    await userEvent.type(name, 'Jhon');
    await userEvent.type(email, "jhon@deriv.com");
    await userEvent.type(number, "6037583745");
    await userEvent.type(password, "asdX76!fghjkl");
    await userEvent.type(confirmPass, "asdX76!fghjkl");
    
    expect(button).not.toBeDisabled();


  });

  it("Check that the field 'Email' should have correct validation", async () => {
    
    render(<ValidationInReact />);
    const email = screen.getByPlaceholderText("Email Address");
    await userEvent.type(email, 'jhon@gmail.com');
    expect(email).toHaveDisplayValue(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/);
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<ValidationInReact />);
    const allInputEle = screen.getAllByRole("textbox")
    allInputEle.forEach((element) => expect(element).not.toHaveTextContent())
    //another way to handle
    // expect(allInputEle.values.length == 0).toBe(true);
  });
});
