import React, { useEffect, useState } from "react";
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

import { tournamentPath, postRequest } from "../constants/Api";

const CustomSeed = ({
  seed,
  breakpoint,
  roundIndex,
  seedIndex,
  rounds,
}: {
  seed: RenderSeedProps["seed"];
  breakpoint: RenderSeedProps["breakpoint"];
  roundIndex: RenderSeedProps["roundIndex"];
  seedIndex: RenderSeedProps["seedIndex"];
  rounds: Array<RenderSeedProps["seed"]>;
}) => {
  // ------ assuming rounds is the losers brackets rounds ------
  // losers rounds usually got some identical seeds amount like (2 - 2 - 1 - 1)

  // We can use seed ID to determine if we're in winners or losers

  // mobileBreakpoint is required to be passed down to a seed
  const isLineConnector: boolean =
    rounds[roundIndex].seeds.length === rounds[roundIndex + 1]?.seeds.length;

  const Wrapper = isLineConnector ? SingleLineSeed : Seed;
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
  const [winners, setWinners] = useState([]);
  const [losers, setLosers] = useState([]);
  useEffect(() => {
    postRequest({
      path: tournamentPath,
      body: body,
      callback: (json: JSON) => {
        setWinners(json.rounds.winners);
        setLosers(json.rounds.losers);
      },
    });
  }, []);

  let body = JSON.stringify({
    tourney_id: 69420,
  });

  function winnersSeedRenderer({
    seed,
    breakpoint,
    roundIndex,
    seedIndex,
  }: {
    seed: RenderSeedProps["seed"];
    breakpoint: RenderSeedProps["breakpoint"];
    roundIndex: RenderSeedProps["roundIndex"];
    seedIndex: RenderSeedProps["seedIndex"];
  }) {
    return CustomSeed({
      seed,
      breakpoint,
      roundIndex,
      seedIndex,
      rounds: winners,
    });
  }
  function losersSeedRenderer({
    seed,
    breakpoint,
    roundIndex,
    seedIndex,
  }: {
    seed: RenderSeedProps["seed"];
    breakpoint: RenderSeedProps["breakpoint"];
    roundIndex: RenderSeedProps["roundIndex"];
    seedIndex: RenderSeedProps["seedIndex"];
  }) {
    return CustomSeed({
      seed,
      breakpoint,
      roundIndex,
      seedIndex,
      rounds: losers,
    });
  }
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
        renderSeedComponent={winnersSeedRenderer}
      />
      <Bracket
        rounds={losers}
        roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
          return (
            <div style={{ textAlign: "center", color: "red" }}>{title}</div>
          );
        }}
        renderSeedComponent={losersSeedRenderer}
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
