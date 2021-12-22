import React from "react";
import { render } from "@testing-library/react-native";
import CreateTournamentScreen from "../CreateTournamentScreen";


describe("CreateTournamentScreen", () => {
    test("it renders header and name input", () => {
        const { getByText, getByRole } = render(<CreateTournamentScreen />);
        expect(getByText("Create Tournament")).toBeDefined();
        expect(getByText("Tournament Name")).toBeDefined();
        
        // Create Button
        expect(getByRole("button")).toBeDefined();
    });
})
