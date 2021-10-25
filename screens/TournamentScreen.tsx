import React, { useEffect, useState } from "react";
import Svg, { Line } from "react-native-svg";
import {
  Text,
  View as BackgroundView,
  ScrollView,
  ViewProps,
} from "../components/Themed";
import { StyleSheet, Dimensions } from "react-native";
import Colors from "../constants/Colors";

import { RootStackScreenProps } from "../types";

import { tournamentPath, postRequest } from "../constants/Api";

const strokeColor = "#b00";
const svgWidth = 30;
let ScreenHeight = Dimensions.get("window").height;
let ScreenWidth = Dimensions.get("window").width;
type RoundProps = {
  seeds: any[];
  title: string;
  [key: string]: any;
};

type RenderSeedProps = {
  seed: any;
  breakpoint: number;
  roundIndex: number;
  seedIndex: number;
};

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
  RoundTitleComponent?: ({
    title,
    roundIdx,
  }: {
    title: string;
    roundIdx: number;
  }) => any;
  /**
   * @param {object} seed the current seed
   * @param {number} breakpoint the breakpoint used to determine responsive size
   * @param {number} roundIdx the current round index
   */
  RenderSeedComponent?: ({
    seed,
    breakpoint,
    roundIndex,
    seedIndex,
  }: RenderSeedProps) => any;
};

function TitleComponent({ title, roundIdx }: { title: any; roundIdx: number }) {
  return (
    <BackgroundView style={styles.titleContainer}>
      <BackgroundView style={{ width: svgWidth }} />
      <BackgroundView style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </BackgroundView>
      <BackgroundView style={{ width: svgWidth }} />
    </BackgroundView>
  );
}

function BracketLine() {
  return (
    <Svg
      style={{ width: svgWidth, height: 30, backgroundColor: "transparent" }}
    >
      <Line
        x1="0"
        y1="50%"
        x2="100"
        y2="50%"
        stroke={strokeColor}
        strokeWidth="1"
      />
    </Svg>
  );
}
function Junction({ isLineConnector }: { isLineConnector: boolean }) {
  if (!isLineConnector) {
    return <BracketLine />;
  }
  let start = 0; //100 * (25 / total);
  let end = 100; //(100 * (total - 25)) / total;
  return (
    <Svg
      style={{
        width: svgWidth,
        height: 80,
        backgroundColor: "transparent",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Line
        x1="0"
        y1={start.toString() + "%"}
        x2="0"
        y2={end.toString() + "%"}
        stroke={strokeColor}
        strokeWidth="2"
      />
      <Line
        x1="0"
        y1="50%"
        x2="100"
        y2="50%"
        stroke={strokeColor}
        strokeWidth="1"
      />
    </Svg>
  );
}

const VerticalMargin = 5;
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
  const bracket = seed.losers ? "losers" : "winners";
  let rounds = tourney[bracket];

  const isLineConnector: boolean =
    rounds[roundIndex].seeds.length === rounds[roundIndex + 1]?.seeds.length;

  //const Wrapper = isLineConnector ? SingleLineSeed : Seed;

  function LineComp() {
    if (roundIndex === 0) {
      return <View style={{ width: svgWidth }} />;
    } else {
      return <Junction isLineConnector={isLineConnector} />;
    }
  }
  function EndComp() {
    if (roundIndex === rounds.length - 1) {
      return <View style={{ width: svgWidth }} />;
    } else {
      return <BracketLine />;
    }
  }
  return (
    <BackgroundView
      style={{
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
      }}
    >
      <LineComp />
      <BackgroundView style={styles.seed}>
        <View style={styles.seedItem}>
          <View>
            <View style={styles.seedTeam}>
              <View style={styles.seedTextContainer}>
                <Text style={styles.text}>
                  {seed.teams[0]?.name || "NO TEAM "}
                </Text>
              </View>
              <View style={styles.scoreTextContainer}>
                <Text style={styles.text}>{seed.teams[0]?.game}</Text>
              </View>
            </View>
            <View
              style={styles.separator}
              lightColor="#eee"
              darkColor="rgba(255,255,255,0.1)"
            />
            <View style={styles.seedTeam}>
              <View style={styles.seedTextContainer}>
                <Text style={styles.text}>
                  {seed.teams[1]?.name || "NO TEAM "}
                </Text>
              </View>
              <View style={styles.scoreTextContainer}>
                <Text style={styles.text}>{seed.teams[1]?.game}</Text>
              </View>
            </View>
          </View>
        </View>
      </BackgroundView>
      <EndComp />
    </BackgroundView>
  );
};

function SingleElimination({
  rounds,
  roundClassName,
  bracketClassName,
  mobileBreakpoint = 992,
  RoundTitleComponent,
  RenderSeedComponent,
}: SingleEliminationProps) {
  // Checking responsive size

  if (RoundTitleComponent == undefined || RenderSeedComponent == undefined) {
    return <View>Bad props</View>;
  }

  if (rounds.length === 0) {
    return <BackgroundView />;
  }
  var Rounds = rounds.map((round, roundIdx) => {
    return (
      <BackgroundView style={styles.round} key={roundIdx}>
        <RoundTitleComponent title={round.title} roundIdx={roundIdx} />
        <BackgroundView style={styles.seedList}>
          {round.seeds.map((seed, idx) => {
            return (
              <BackgroundView key={idx} style={styles.container}>
                <RenderSeedComponent
                  seed={seed}
                  breakpoint={mobileBreakpoint}
                  roundIndex={roundIdx}
                  seedIndex={idx}
                />
              </BackgroundView>
            );
          })}
        </BackgroundView>
      </BackgroundView>
    );
  });
  return <BackgroundView style={styles.bracket}>{Rounds}</BackgroundView>;
}

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

  function callback(response: { rounds: TourneyProps }) {
    setTourney(response.rounds);
  }
  useEffect(() => {
    postRequest({
      path: tournamentPath,
      body: body,
      callback: callback,
    });
    return;
  }, []);

  let body = JSON.stringify({
    tourney_id: 69420,
  });

  function SeedRenderer({
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
    return (
      <CustomSeed
        seed={seed}
        breakpoint={breakpoint}
        roundIndex={roundIndex}
        seedIndex={seedIndex}
        tourney={tourney}
      />
    );
  }
  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={{
        flexGrow: 1,
        alignItems: "flex-start",
        justifyContent: "flex-start",
      }}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: "flex-start",
          justifyContent: "flex-start",
        }}
      >
        <SingleElimination
          rounds={tourney.winners}
          RoundTitleComponent={TitleComponent}
          RenderSeedComponent={SeedRenderer}
        />
        <SingleElimination
          rounds={tourney.losers}
          RoundTitleComponent={TitleComponent}
          RenderSeedComponent={SeedRenderer}
        />
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  titleContainer: {
    flex: 1,
    width: 175,
    height: 60,
    marginVertical: 10,
  },
  title: {
    fontWeight: "bold",
    flex: 1,
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
    display: "flex",
    flexDirection: "column",
    borderRadius: 6,
    marginVertical: 10,
    alignItems: "center",
    height: 60,
  },
  seedTeam: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    width: 165,
    margin: 10,
  },
  seed: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    borderRadius: 4,
  },
  separator: {
    height: 1,
  },
  scoreTextContainer: {
    backgroundColor: "#701",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 3,
    height: 15,
    width: 15,
  },
  text: {},
  seedTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    height: 15,
  },
  bracket: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flex: 1,
  },
  seedList: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  round: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
    width: 175 + 2 * svgWidth,
  },
});
