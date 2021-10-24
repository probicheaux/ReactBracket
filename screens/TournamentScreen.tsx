import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View as BackgroundView, ViewProps } from "../components/Themed";
import Colors from "../constants/Colors";

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

function View(props: ViewProps) {
  return (
    <BackgroundView darkColor={Colors["dark"]["touchableColor"]} {...props} />
  );
}
type TourneyProps = { winners: RoundProps[]; losers: RoundProps[] };

type SingleEliminationProps = {
  // Array of rounds matching RoundProps shape,
  rounds: RoundProps[];
  // Single round className
  roundClassName?: string;
  /** @default 992, if you don't want a mobile breakpoint, pass 0 */
  mobileBreakpoint?: number;
  // The whole bracket className
  bracketClassName?: string;
  /**
   * @param {ReactNode} title string or component passed with each round
   * @param {number} round the current round index
   */
  roundTitleComponent?: (title: string, roundIdx: number) => any;
  /**
   * @param {object} seed the current seed
   * @param {number} breakpoint the breakpoint used to determine responsive size
   * @param {number} roundIdx the current round index
   */
  renderSeedComponent?: ({ seed, breakpoint, roundIndex, seedIndex }: RenderSeedProps) => any;
}

const SingleElimination = ({
  rounds,
  roundClassName,
  bracketClassName,
  mobileBreakpoint = 992,
  renderSeedComponent,
  roundTitleComponent,
}: SingleEliminationProps) => {
  // Checking responsive size

  if (roundTitleComponent == undefined || renderSeedComponent == undefined){
    return <View>Bad props</View>
  }
  const data = rounds.map((round, roundIdx) => (
    <View style={styles.round} key={roundIdx}>
      {round.title && roundTitleComponent(round.title, roundIdx)}
      <View style={styles.seedList}>
        {round.seeds.map((seed, idx) => (
          <View key={idx}>
            {renderSeedComponent({ seed, breakpoint: mobileBreakpoint, roundIndex: roundIdx, seedIndex: idx })}
          </View>
        ))}
      </View>
    </View>
  ));
  return (
    <View style={styles.bracket}>
      {data}
    </View>
  );
};

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

  //const Wrapper = isLineConnector ? SingleLineSeed : Seed;
  return (
    <BackgroundView
      style={isLineConnector ? styles.singleLineSeed : styles.seed}
    >
      <View style={styles.seedItem}>
        <View>
          <View style={styles.seedTeam}>
            <Text style={styles.seedText}>
              {seed.teams[0]?.name || "NO TEAM "}
            </Text>
            <Text style={styles.scoreText}>{seed.teams[0]?.game}</Text>
          </View>
          <View
            style={styles.separator}
            lightColor="#eee"
            darkColor="rgba(255,255,255,0.1)"
          />
          <View style={styles.seedTeam}>
            <Text style={styles.seedText}>
              {seed.teams[1]?.name || "NO TEAM "}
            </Text>
            <Text style={styles.scoreText}>{seed.teams[1]?.game}</Text>
          </View>
        </View>
      </View>
    </BackgroundView>
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
    <BackgroundView style={styles.container}>
      <BackgroundView style={styles.container}>
        <SingleElimination
          rounds={tourney.winners}
          roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
            return (
              <BackgroundView style={{ margin: "2px", alignItems: "center" }}>
                <Text style={styles.title}>{title}</Text>
              </BackgroundView>
            );
          }}
          renderSeedComponent={seedRenderer}
        />
        <SingleElimination
          rounds={tourney.losers}
          roundTitleComponent={(title: React.ReactNode, roundIndex: number) => {
            return (
              <BackgroundView style={{ margin: "2px", alignItems: "center" }}>
                <Text style={styles.title}>{title}</Text>
              </BackgroundView>
            );
          }}
          renderSeedComponent={seedRenderer}
        />
      </BackgroundView>
    </BackgroundView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 5,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
  seedItem: {
    width: "100%",
    padding: 2,
    textAlign: "center",
    position: "relative",
    flexDirection: "column",
    margin: 2,
  },
  seedTeam: {
    padding: "1.5rem 1.5rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: "10px",
    marginVertical: 5,
  },
  seed: {
    padding: "1em 1.5em",
    minWidth: 225,
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    fontSize: 14,
    margin: "5px",
    marginHorizontal: "40px",
  },
  singleLineSeed: {
    padding: "1em 1.5em",
    minWidth: 225,
    width: "100%",
    position: "relative",
    display: "flex",
    alignItems: "center",
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    fontSize: 14,
    margin: "1px",
  },
  separator: {
    marginVertical: 3,
    height: 1,
    width: "100%",
  },
  scoreText: {
    backgroundColor: "#702",
    padding: 2,
    textAlign: "center",
    width: "1.5em",
    height: "1.5em",
    alignItems: "center",
    justifyContent: "center",
  },
  seedText: {
    padding: 2,
    textAlign: "center",
    height: "1.5em",
    alignItems: "center",
    justifyContent: "center",
  },
  bracket: {
    display: "flex",
    flexDirection: "row",
  },
  seedList: {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    flexFlow: "row wrap",
    justifyContent: "center",
    height: "100%",
    listStyle: "none",
  },
  round: {
    flex: 0,
    display: "flex",
    flexDirection: "column",
  }
});
