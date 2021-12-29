import React from "react";
import { render } from "@testing-library/react-native";
import JoinTournamentScreen from "../JoinTournamentScreen";


const testNav = jest.fn();

describe("JoinTournamentScreen", () => {
    test("it renders header and search input", () => {
        const { getByText, getByRole } = render(<JoinTournamentScreen navigation={testNav} />);
        expect(getByText("Join Tournament")).toBeDefined();
        expect(getByText("Search by name")).toBeDefined();
        
        // Look for input text field as well
    });
})
