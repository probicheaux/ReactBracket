import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
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
        {
            id: "12345",
            name: "banana tournament 2",
            brackets: [{id: 2, name: "fun"}, {id: 3, name: "serious"}],
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

        test("it submits search request after user enters text search. Tap to navigate to details", async() => {
            const { getByTestId, findByText, getByText } = render(<SearchTournamentScreen navigation={testNav} />);
    
            const input = getByTestId('searchTournamentNameInput');
            fireEvent.changeText(input, 'banana');
            fireEvent(input, 'submitEditing');

            // Need to asyncronously wait for "finding" the results
            await waitFor(() => findByText("banana tournament"));

            expect(mockSearchRequest).toHaveBeenCalledTimes(1)
            
            // Now we can "get" the element since we've waited 
            fireEvent.press(getByText("banana tournament"));
            expect(testNav.navigate).toHaveBeenCalledWith("TournamentDetailsSearch", {id:"123", viewMode: "join"});

        });
    })

})
