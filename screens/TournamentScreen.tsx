import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { RootStackScreenProps } from "../types";
import {
  Bracket,
  RoundProps,
  Seed,
  SeedItem,
  SeedTeam,
  RenderSeedProps,
  SingleLineSeed,
} from "react-brackets";

const winners: RoundProps[] = [
  {
    title: "Winner's Semifinals",
    seeds: [
      {
        id: 1,
        losers: false,
        date: new Date().toDateString(),
        teams: [
          { name: "Spark", game: 3 },
          { name: "Traplord", game: 0 },
        ],
      },
      {
        id: 2,
        losers: false,
        date: new Date().toDateString(),
        teams: [
          { name: "Nickemwit", game: 2 },
          { name: "Umarth", game: 3 },
        ],
      },
    ],
  },
  {
    title: "Winner's Finals",
    seeds: [
      {
        id: 3,
        losers: false,
        date: new Date().toDateString(),
        teams: [
          { name: "Spark", game: 3 },
          { name: "Umarth", game: 0 },
        ],
      },
    ],
  },
  {
    title: "Grand Finals",
    seeds: [
      {
        id: 4,
        losers: false,
        date: new Date().toDateString(),
        teams: [
          { name: "Spark", game: 3 },
          { name: "Umarth", game: 0 },
        ],
      },
    ],
  },
];

const losers: RoundProps[] = [
  {
    title: "Loser's Round One",
    seeds: [
      {
        id: 1,
        losers: true,
        date: new Date().toDateString(),
        teams: [
          { name: "Notorious", game: 3 },
          { name: "Typhoon", game: 2 },
        ],
      },
      {
        id: 2,
        losers: true,
        date: new Date().toDateString(),
        teams: [
          { name: "soccermom69", game: 3 },
          { name: "Snap", game: 0 },
        ],
      },
    ],
  },
  {
    title: "Loser's Quarterfinals",
    seeds: [
      {
        id: 3,
        losers: true,
        date: new Date().toDateString(),
        teams: [
          { name: "Nickemwit", game: 3 },
          { name: "Notorious", game: 0 },
        ],
      },
      {
        id: 4,
        losers: true,
        date: new Date().toDateString(),
        teams: [
          { name: "Traplord", game: 1 },
          { name: "soccermom69", game: 3 },
        ],
      },
    ],
  },
  {
    title: "Loser's Semifinals",
    seeds: [
      {
        id: 5,
        losers: true,
        date: new Date().toDateString(),
        teams: [
          { name: "Nickemwit", game: 3 },
          { name: "soccermom69", game: 0 },
        ],
      },
    ],
  },
  {
    title: "Loser's Finals",
    seeds: [
      {
        id: 6,
        losers: true,
        date: new Date().toDateString(),
        teams: [
          { name: "Umarth", game: 3 },
          { name: "Nickemwit", game: 0 },
        ],
      },
    ],
  },
];

const CustomSeed = ({
  seed,
  breakpoint,
  roundIndex,
  seedIndex,
}: RenderSeedProps) => {
  // ------ assuming rounds is the losers brackets rounds ------
  // losers rounds usually got some identical seeds amount like (2 - 2 - 1 - 1)

  // We can use seed ID to determine if we're in winners or losers
  let isLineConnector: boolean = false;
  if (seed.losers) {
    isLineConnector =
      losers[roundIndex].seeds.length === losers[roundIndex + 1]?.seeds.length;
  } else {
    isLineConnector =
      winners[roundIndex].seeds.length ===
      winners[roundIndex + 1]?.seeds.length;
  }

  const Wrapper = isLineConnector ? SingleLineSeed : Seed;

  // mobileBreakpoint is required to be passed down to a seed
  return (
    <Wrapper mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem>
        <div>
          <SeedTeam>
            {seed.teams[0]?.name || "NO TEAM "}
            <span style={{ backgroundColor: "red" }}>
              {seed.teams[0]?.game}
            </span>
          </SeedTeam>
          <SeedTeam>
            {seed.teams[1]?.name || "NO TEAM "}
            <span style={{ backgroundColor: "red" }}>
              {seed.teams[1]?.game}
            </span>
          </SeedTeam>
        </div>
      </SeedItem>
    </Wrapper>
  );
};

export default function TournamentScreen({
  route,
  navigation,
}: RootStackScreenProps<"Tournament">) {
  const { name } = route.params;
  useEffect(() => {
    navigation.setOptions({ title: name });
  }, []);
  return (
    <View
      style={{
        ...styles.container,
        ...{ title: name },
      }}
    >
      <Text style={styles.title}>{name} screen doesn't exist.</Text>
      <Bracket
        rounds={winners}
        roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
          return (
            <div style={{ textAlign: "center", color: "red" }}>{title}</div>
          );
        }}
        renderSeedComponent={CustomSeed}
      />
      <Bracket
        rounds={losers}
        roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
          return (
            <div style={{ textAlign: "center", color: "red" }}>{title}</div>
          );
        }}
        renderSeedComponent={CustomSeed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});
