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
const seedListWidth = 150;
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
    <Svg style={styles.svgStyle}>
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
    <Svg style={styles.svgStyle}>
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
    <BackgroundView style={styles.seedWithLines}>
      <LineComp />
      <View style={styles.seedItem}>
        <View style={styles.seedTeam}>
          <View style={styles.seedTextContainer}>
            <Text style={styles.text}>{seed.teams[0]?.name || "NO TEAM "}</Text>
          </View>
          <View style={styles.scoreTextContainer} darkColor="#701">
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
            <Text style={styles.text}>{seed.teams[1]?.name || "NO TEAM "}</Text>
          </View>
          <View style={styles.scoreTextContainer} darkColor="#701">
            <Text style={styles.text}>{seed.teams[1]?.game}</Text>
          </View>
        </View>
      </View>
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
              <RenderSeedComponent
                seed={seed}
                breakpoint={mobileBreakpoint}
                roundIndex={roundIdx}
                seedIndex={idx}
              />
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
    <BackgroundView style={{ flex: 1 }}>
      <ScrollView horizontal={true} contentContainerStyle={{}}>
        <ScrollView
          contentContainerStyle={{ flexDirection: "column" }}
          nestedScrollEnabled={true}
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
    </BackgroundView>
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
    marginVertical: 10,
    flexDirection: "row",
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
  bracket: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    height: "100%",
  },
  round: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "space-between",
    flex: 1,
    minWidth: seedListWidth + 2 * svgWidth,
    maxWidth: seedListWidth + 2 * svgWidth,
    height: "100%",
  },
  seedList: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  seedWithLines: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "100%",
  },
  seedItem: {
    flexDirection: "column",
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    width: seedListWidth,
    height: 60,
    flex: 1,
    padding: 5,
    marginVertical: 10,
  },
  seedTeam: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flex: 1,
  },
  seedTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
  },
  separator: {
    height: 1,
    width: "100%",
  },
  scoreTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 3,
    height: 15,
    width: 15,
  },
  svgStyle: { width: svgWidth, height: 80 },
  text: {},
});
