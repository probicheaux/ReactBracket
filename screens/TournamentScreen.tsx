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

type TourneyProps = { winners: RoundProps[]; losers: RoundProps[] };
const CustomSeed = ({
  seed,
  breakpoint,
  roundIndex,
  seedIndex,
  tourney,
}: {
  seed: RenderSeedProps["seed"];
  breakpoint: RenderSeedProps["breakpoint"];
  roundIndex: RenderSeedProps["roundIndex"];
  seedIndex: RenderSeedProps["seedIndex"];
  tourney: TourneyProps;
}) => {
  // ------ assuming rounds is the losers brackets rounds ------
  // losers rounds usually got some identical seeds amount like (2 - 2 - 1 - 1)

  // mobileBreakpoint is required to be passed down to a seed
  let rounds = tourney[seed.losers ? "losers" : "winners"];

  const isLineConnector: boolean =
    rounds[roundIndex].seeds.length === rounds[roundIndex + 1]?.seeds.length;

  const Wrapper = isLineConnector ? SingleLineSeed : Seed;
  return (
    <Wrapper mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem>
        <View>
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
        </View>
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

  // TypeScript fuckery
  const emptyTourney: TourneyProps = {
    winners: [] as RoundProps[],
    losers: [] as RoundProps[],
  };
  const [tourney, setTourney] = useState(emptyTourney);

  useEffect(() => {
    postRequest({
      path: tournamentPath,
      body: body,
      callback: (json: { rounds: TourneyProps }) => {
        setTourney(json.rounds);
      },
    });
  }, []);

  let body = JSON.stringify({
    tourney_id: 69420,
  });

  function seedRenderer({
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
      tourney: tourney,
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
        rounds={tourney.winners}
        roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
          return (
            <View style={{ textAlign: "center", color: "red" }}>{title}</View>
          );
        }}
        renderSeedComponent={seedRenderer}
      />
      <Bracket
        rounds={tourney.losers}
        roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
          return (
            <View style={{ textAlign: "center", color: "red" }}>{title}</View>
          );
        }}
        renderSeedComponent={seedRenderer}
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
