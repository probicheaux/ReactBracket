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

// Need to test with non power of 2 number of entrants

const strokeColor = "#b00";
const svgWidth = 30;
const seedListWidth = 200;
const seedHeight = 65;
const seedSpacerHeight = 20;
const titleHeight = 40;
const titleMargin = 10;
const bracketMargin = 50;
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
    <BackgroundView
      lightColor={Colors["light"]["touchableColor"]}
      darkColor={Colors["dark"]["touchableColor"]}
      {...props}
    />
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
      <BackgroundView style={styles.titleTextContainer}>
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
        x1="0%"
        y1="50%"
        x2="100%"
        y2="50%"
        stroke={strokeColor}
        strokeWidth="1"
      />
    </Svg>
  );
}
function Junction({
  isLineConnector,
  height,
}: {
  isLineConnector: boolean;
  height: number;
}) {
  if (isLineConnector) {
    return <BracketLine />;
  }
  let start = 0; //100 * (25 / total);
  let end = 100; //(100 * (total - 25)) / total;
  return (
    <Svg style={[styles.svgStyle, { height: height, width: svgWidth }]}>
      <Line
        x1="0%"
        y1="0%"
        x2="0%"
        y2="100%"
        stroke={strokeColor}
        strokeWidth="2"
      />
      <Line
        x1="0%"
        y1="50%"
        x2="100%"
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
  const bracket = seed.losers ? "losers" : "winners";
  let rounds = tourney[bracket];

  let oneSpacerHeight = seedHeight + seedSpacerHeight;
  var spacerHeight;
  var index;

  // Losers seeds will have the same spacing for consectutive rounds
  if (seed.losers) {
    index = Math.floor(roundIndex / 2);
  } else {
    index = roundIndex;
  }

  // Each winning seed eats it's children's spacers
  // or
  // The number of seed sized blocks is constant,
  // the number of actual seeds halves each round
  if (index > 0) {
    let j = Math.pow(2, index - 1);
    spacerHeight = oneSpacerHeight * j;
  } else {
    spacerHeight = 0;
  }

  let junctionHeight = spacerHeight;
  function LineComp() {
    if (roundIndex === 0) {
      return (
        <BackgroundView
          style={{
            width: svgWidth,
            height: seedHeight,
            position: "relative",
          }}
        />
      );
    } else {
      let isLineConnector: boolean =
        rounds[roundIndex - 1].seeds.length ===
        rounds[roundIndex]?.seeds.length;
      return (
        <Junction isLineConnector={isLineConnector} height={junctionHeight} />
      );
    }
  }

  // We want to pad to midpoint, not start of seed
  spacerHeight = spacerHeight - oneSpacerHeight / 2;

  spacerHeight = spacerHeight - (junctionHeight - seedHeight) / 2;
  spacerHeight = Math.max(spacerHeight, 0);
  // The spacer height already has the part of the junction
  // that isn't the seed accounted for
  function EndComp() {
    if (roundIndex === rounds.length - 1) {
      return <View style={{ width: svgWidth }} />;
    } else {
      return <BracketLine />;
    }
  }

  let seedWithLinesHeight = Math.max(junctionHeight, seedHeight);
  let topWin = seed.teams[0]?.game > seed.teams[1]?.game;

  let darkWin = Colors["dark"]["winColor"];
  let darkLose = Colors["dark"]["loseColor"];
  let lightWin = Colors["light"]["winColor"];
  let lightLose = Colors["light"]["loseColor"];
  let start =
    spacerHeight +
    seedSpacerHeight +
    seedIndex * (2 * spacerHeight + seedWithLinesHeight + seedSpacerHeight);
  return (
    <BackgroundView
      style={[
        styles.seedWithLinesContainer,
        { top: start, height: seedWithLinesHeight },
      ]}
    >
      <BackgroundView
        style={[styles.seedWithLines, { height: seedWithLinesHeight }]}
      >
        <LineComp />
        <View style={styles.seedItem}>
          <View style={styles.seedTeam}>
            <View style={styles.seedTextContainer}>
              <Text
                adjustsFontSizeToFit
                style={topWin ? styles.scoreTextWin : styles.scoreTextLose}
              >
                {seed.teams[0]?.name || "NO TEAM "}
              </Text>
            </View>
            <View
              style={styles.scoreTextContainer}
              darkColor={topWin ? darkWin : darkLose}
              lightColor={topWin ? lightWin : lightLose}
            >
              <Text style={topWin ? styles.scoreTextWin : styles.scoreTextLose}>
                {seed.teams[0]?.game}
              </Text>
            </View>
          </View>
          <View
            style={styles.separator}
            lightColor="rgba(0,0,0,0.1)"
            darkColor="rgba(255,255,255,0.1)"
          />
          <View style={styles.seedTeam}>
            <View style={styles.seedTextContainer}>
              <Text
                adjustsFontSizeToFit
                style={topWin ? styles.scoreTextLose : styles.scoreTextWin}
              >
                {seed.teams[1]?.name || "NO TEAM "}
              </Text>
            </View>
            <View
              style={styles.scoreTextContainer}
              darkColor={topWin ? darkLose : darkWin}
              lightColor={topWin ? lightLose : lightWin}
            >
              <Text style={topWin ? styles.scoreTextLose : styles.scoreTextWin}>
                {seed.teams[1]?.game}
              </Text>
            </View>
          </View>
        </View>
        <EndComp />
      </BackgroundView>
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

  let seedListHeight =
    rounds[0].seeds.length * (seedSpacerHeight + seedHeight) + seedSpacerHeight;
  let heightDict = { height: seedListHeight + titleHeight + bracketMargin };
  var Rounds = rounds.map((round, roundIdx) => {
    return (
      <BackgroundView style={[styles.round, heightDict]} key={roundIdx}>
        <RoundTitleComponent title={round.title} roundIdx={roundIdx} />
        <BackgroundView style={[styles.seedList, { height: seedListHeight }]}>
          {round.seeds.map((seed, idx) => {
            return (
              <BackgroundView
                style={{
                  flex: 0,
                  flexDirection: "row",
                  width: 2 * svgWidth + seedListWidth,
                  position: "relative",
                }}
              >
                <RenderSeedComponent
                  seed={seed}
                  breakpoint={mobileBreakpoint}
                  roundIndex={roundIdx}
                  seedIndex={idx}
                  key={idx}
                />
              </BackgroundView>
            );
          })}
        </BackgroundView>
      </BackgroundView>
    );
  });
  return (
    <BackgroundView style={[styles.bracket, heightDict]}>
      {Rounds}
    </BackgroundView>
  );
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
    <ScrollView contentContainerStyle={{ width: ScreenWidth }}>
      <ScrollView
        contentContainerStyle={{
          flexDirection: "column",
        }}
        horizontal={true}
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
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "relative",
    flex: 1,
  },
  titleContainer: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    height: titleHeight,
  },
  titleTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    width: seedListWidth,
  },
  title: {
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
  bracket: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    position: "relative",
  },
  round: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginVertical: 10,
    width: 2 * svgWidth + seedListWidth,
    position: "relative",
  },
  seedList: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
    flex: 1,
    width: 2 * svgWidth + seedListWidth,
    position: "relative",
  },
  seedWithLinesContainer: {
    position: "absolute",
    width: 2 * svgWidth + seedListWidth,
    left: 0,
    flexDirection: "row",
    alignItems: "center",
  },
  seedWithLines: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 2 * svgWidth + seedListWidth,
  },
  seedItem: {
    flexDirection: "column",
    borderRadius: 6,
    alignItems: "center",
    alignContent: "center",
    justifyContent: "space-around",
    width: seedListWidth,
    height: seedHeight,
    paddingVertical: 3,
    paddingHorizontal: 4,
  },
  seedTeam: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignContent: "center",
    width: "100%",
    paddingLeft: 6,
  },
  seedTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
    paddingTop: 4,
    paddingBottom: 2,
  },
  separator: {
    height: 1,
    width: "100%",
    marginHorizontal: 4,
  },
  scoreTextContainer: {
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 3,
    height: 20,
    width: 20,
  },
  scoreTextWin: {
    textAlign: "center",
    textAlignVertical: "center",
    fontWeight: "bold",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },
  scoreTextLose: {
    textAlign: "center",
    textAlignVertical: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
  },
  svgStyle: { width: svgWidth, height: seedHeight },
  text: {
    textAlign: "center",
    textAlignVertical: "center",
    alignContent: "center",
    includeFontPadding: false,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 0,
    paddingBottom: 0,
  },
});
