import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import App from "../App";

describe("Tasks", () => {
  it("Select the option and check that option 'male' was selected", () => {
    render(<App />);
    const male_option = screen.getByRole("option", { name: "male" });
    userEvent.selectOptions(screen.getByRole("combobox"), male_option);
    expect(male_option.selected).toBe(true);
  });

  it("Check that the user has filled the form except of gender select", async () => {
    render(<App />);
    const select_option = screen.getByRole("option", { name: "select" });
    const first_name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");
    const mobile = screen.getByPlaceholderText("mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("confirm Password");

    await userEvent.type(first_name, "Niloofar");
    await userEvent.type(email, "niloo@gmail.com");
    await userEvent.type(mobile, "6876554334");
    await userEvent.type(password, "Nr123456");
    await userEvent.type(confirm_password, "Nr123456");

    expect(first_name).toHaveDisplayValue("Niloofar");
    expect(email).toHaveDisplayValue("niloo@gmail.com");
    expect(mobile).toHaveDisplayValue("6876554334");
    expect(password).toHaveDisplayValue("Nr123456");
    expect(confirm_password).toHaveDisplayValue("Nr123456");
    expect(select_option).toBeVisible();
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", async () => {
    render(<App />);
    const first_name = screen.getByPlaceholderText("First Name");
    await userEvent.type(first_name, "N");
    expect(screen.getByText("First name is Required")).toBeInTheDocument();
    await userEvent.type(first_name, "Ni");
    expect(screen.queryByText("First name is Required")).toBeFalsy();
  });

  it("Check that the button submit was clicked", async () => {
    const mock_alert = jest.spyOn(window, "alert").mockImplementation();

    render(<App />);
    const button = screen.getByRole("button", { name: "Submit" });
    const first_name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");
    const mobile = screen.getByPlaceholderText("mobile");
    const password = screen.getByPlaceholderText("Password");
    const confirm_password = screen.getByPlaceholderText("confirm Password");

    await userEvent.type(first_name, "Niloofar");
    await userEvent.type(email, "niloo@gmail.com");
    await userEvent.type(mobile, "6876554334");
    await userEvent.type(password, "Nr123456");
    await userEvent.type(confirm_password, "Nr123456");

    expect(button).not.toBeDisabled();
    await userEvent.click(button);

    expect(mock_alert).toHaveBeenCalledTimes(1);
  });

  it("Check that the form has a class", () => {
    render(<App />);
    const form = screen.getByRole("form");
    expect(form).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have a content", () => {
    render(<App />);
    expect(screen.getByLabelText("Choose a gender:")).toBeInTheDocument();
    expect(screen.getByLabelText("First name:")).toBeInTheDocument();
    expect(screen.getByLabelText("Email:")).toBeInTheDocument();
    expect(screen.getByLabelText("Mobile:")).toBeInTheDocument();
    expect(screen.getByLabelText("Password:")).toBeInTheDocument();
    expect(screen.getByLabelText("Confirm Password:")).toBeInTheDocument();
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    render(<App />);
    const select = screen.getByRole("combobox");
    const select_option = screen.getByRole("option", { name: "select" });
    userEvent.click(select);
    expect(select_option).toBeVisible();
  });

  it("Check that the user can't to submit until fields will be correct filled", async () => {
    render(<App />);
    const submit = screen.getByRole("button", { name: "Submit" });
    const first_name = screen.getByPlaceholderText("First Name");
    const email = screen.getByPlaceholderText("Email Address");

    await userEvent.type(email, "niloo");
    expect(submit).toBeDisabled();
    await userEvent.type(first_name, "N");
    expect(submit).toBeDisabled();

    // the rest of the inputs are the same

    await userEvent.type(first_name, "Niloofar");
    await userEvent.type(email, "niloo@gmail.com");
    expect(submit).not.toBeDisabled();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", async () => {
    render(<App />);
    const email = screen.getByPlaceholderText("Email Address");
    await userEvent.type(email, "niloo");
    expect(screen.getByText("Enter a valid email address")).toBeInTheDocument();
    await userEvent.type(email, "niloo@gmail.com");
    expect(screen.queryByText("Email is Required")).toBeFalsy();
    expect(screen.queryByText("Enter a valid email address")).toBeFalsy();
  });

  it("Check that all fields on the first render should be empty", () => {
    render(<App />);
    expect(screen.getByPlaceholderText("First Name")).not.toHaveValue();
    expect(screen.getByPlaceholderText("Email Address")).not.toHaveValue();
    expect(screen.getByPlaceholderText("mobile")).not.toHaveValue();
    expect(screen.getByPlaceholderText("Password")).not.toHaveValue();
    expect(screen.getByPlaceholderText("confirm Password")).not.toHaveValue();
  });
});
