import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { async } from "q";

describe("Tasks", () => {
  beforeEach(() => {
    render(<App />);
  });

  it("Select the option and check that option 'male' was selected", () => {
    userEvent.selectOptions(screen.getByRole("combobox"), "male");
    expect(screen.getByText("male").selected).toBeTruthy();
  });

  it("Check that the user has filled the form except of gender select", () => {
    const form = screen.getByRole("form");
    userEvent.type(screen.getByPlaceholderText("First Name"), "Kate");
    userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "Kate@test.com"
    );
    userEvent.type(screen.getByPlaceholderText("mobile"), "375296304436");
    userEvent.type(screen.getByPlaceholderText("Password"), "Bla-bla_test1");
    userEvent.type(
      screen.getByPlaceholderText("confirm Password"),
      "Bla-bla_test1"
    );
    expect(form).toHaveFormValues({
      firstName: "Kate",
      email: "Kate@test.com",
      mobile: "375296304436",
      password: "Bla-bla_test1",
      confirmPassword: "Bla-bla_test1",
    });
  });

  it("Check that the field 'First Name' was focused and filled with min 2 letters", () => {
    const firstName = screen.getByPlaceholderText("First Name");
    userEvent.type(firstName, "Kate");
    expect(firstName).toHaveDisplayValue(/[a-z]{2,}/i);
    expect(firstName).toHaveFocus();
  });

  it("Check that the button submit was clicked", () => {
    const btn = screen.getByRole("button");
    const userClick = jest.fn();
    btn.addEventListener("click", userClick);
    userEvent.click(btn);
    expect(userClick).toHaveBeenCalled();
  });

  it("Check that the form has a class", () => {
    expect(screen.getByRole("form")).toHaveClass("contacts_form");
  });

  it("Check that the labels of the form have a content", () => {
    //there is no role for label in official documentation, so it was difficult to grip all labels together in 1 array
    //I think, we shouldn't write by ourself artificial attributs for all labels, that is why I used querySelectorAll
    const labelsCollection = document.querySelectorAll("label");
    labelsCollection.forEach((label) =>
      expect(label).not.toBeEmptyDOMElement()
    );
  });

  it("Check that the user can open a list of the gender and doesn't choose anything", () => {
    //option with value 'select' is cheked by default, so it shouldn't be changed after user click on select tag.
    ///select tag is not multiple, so only one option can be selected
    userEvent.click(screen.getByRole("combobox"));
    expect(screen.getByText("select").selected).toBeTruthy();
    //just to be sure you can run this:
    //expect(screen.getByText("male").selected).toBeFalsy();
    //expect(screen.getByText("female").selected).toBeFalsy();
  });

  it("Check that the user can't to submit until fields will be correct filled", () => {
    userEvent.type(screen.getByPlaceholderText("First Name"), "Kate");
    userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "Katetest.com"
    );
    userEvent.type(screen.getByPlaceholderText("mobile"), "8888");
    userEvent.type(screen.getByPlaceholderText("Password"), "Qwe1235");
    userEvent.type(screen.getByPlaceholderText("confirm Password"), "Qwe12345");
    expect(screen.getByRole("button").disabled).toBeTruthy();

    userEvent.clear(screen.getByPlaceholderText("First Name"));
    userEvent.clear(screen.getByPlaceholderText("Email Address"));
    userEvent.clear(screen.getByPlaceholderText("mobile"));
    userEvent.clear(screen.getByPlaceholderText("Password"));
    userEvent.clear(screen.getByPlaceholderText("confirm Password"));

    userEvent.type(screen.getByPlaceholderText("First Name"), "Kate");
    userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "Kate@test.com"
    );
    console.log(screen.getByPlaceholderText("Email Address").value);
    userEvent.type(screen.getByPlaceholderText("mobile"), "8888888888");
    userEvent.type(screen.getByPlaceholderText("Password"), "Qwe12345");
    userEvent.type(screen.getByPlaceholderText("confirm Password"), "Qwe12345");
    expect(screen.getByRole("button").disabled).toBeFalsy();
  });

  it("Check that the field 'Email' should have correct validation, haven't error message", async () => {
    //actually, in ValidationReact.js file there is a regex for cheking -  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    //so, I decided to look for error message on screen
    userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "Katetest.com"
    );
    const warning = await screen.findByText(/Enter a valid email address/i);
    expect(warning).toBeInTheDocument();

    userEvent.clear(screen.getByPlaceholderText("Email Address"));

    userEvent.type(
      screen.getByPlaceholderText("Email Address"),
      "Kate@test.com"
    );
    await waitFor(() =>
      expect(
        screen.queryByText(/Enter a valid email address/i)
      ).not.toBeInTheDocument()
    );
  });

  it("Check that all fields on the first render should be empty", () => {
    //there is no role for input (without specific type, just for pure input) in official documentation, so it was difficult to grip all inputs together in 1 array
    //I think, we shouldn't write by ourself artificial attributs for all inputs, that is why I used querySelectorAll
    const inputCollection = document.querySelectorAll("input");
    inputCollection.forEach((input) =>
      expect(input).not.toHaveDisplayValue(/./)
    );
  });
});
