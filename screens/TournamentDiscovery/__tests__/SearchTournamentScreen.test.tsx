import React from "react";
import { render, fireEvent, act } from "@testing-library/react-native";
import SearchTournamentScreen from "../SearchTournamentScreen";

import * as requests from "../../../api/Requests";

const mockSearchRequest = jest
    .spyOn(requests, "searchForTournament")
    .mockReturnValue([
        {
            id: "123",
            name: "banana tournament",
            brackets: [{id: 0, name: "fun"}, {id: 1, name: "serious"}],
        },
    ]);


const testNav = {
    navigate: jest.fn(),
}

describe("SearchTournamentScreen", () => {
    test("it renders header and search input", () => {
        const { getByText, getByRole, getByTestId } = render(<SearchTournamentScreen navigation={testNav} />);
        expect(getByText("Join Tournament")).toBeDefined();
        expect(getByText("Search by name")).toBeDefined();
        
        // Look for input text field as well
        expect(getByTestId("searchTournamentNameInput")).toBeDefined();
    });

    describe("search results", () => {

        test("it submits search request after user enters text search", () => {
            const { getAllByText, getByTestId } = render(<SearchTournamentScreen navigation={testNav} />);
    
            const input = getByTestId('searchTournamentNameInput');
    
            act(() => {
                /* fire events that update state */
                fireEvent.changeText(input, 'banana');
                fireEvent(input, 'submitEditing');
            });
            
            // Display the search "results"
            const bananaElements = getAllByText('banana tournament');
            expect(bananaElements).toHaveLength(1);

            // Test navigation from tapping on a search result 
            fireEvent.press(bananaElements[0]);
            expect(testNav.navigate).toHaveBeenCalledWith("TournamentDetails", {mode: "join"});
        });

    })

})
