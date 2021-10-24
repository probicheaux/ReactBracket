import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Text, View as BackgroundView, ViewProps } from "../components/Themed";
import Colors from "../constants/Colors";
import Svg, { Path, Polyline, Line, Circle } from "react-native-svg";

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

const strokeColor = "#b00";
const svgWidth = 30;
class DefaultDict {
  constructor(defaultVal) {
    return new Proxy(
      {},
      {
        get: (target, name) => (name in target ? target[name] : defaultVal),
      }
    );
  }
}

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
  renderSeedComponent?: ({
    seed,
    breakpoint,
    roundIndex,
    seedIndex,
  }: RenderSeedProps) => any;
};

const SingleElimination = ({
  rounds,
  roundClassName,
  bracketClassName,
  mobileBreakpoint = 992,
  renderSeedComponent,
  roundTitleComponent,
}: SingleEliminationProps) => {
  // Checking responsive size

  if (roundTitleComponent == undefined || renderSeedComponent == undefined) {
    return <View>Bad props</View>;
  }
  const data = rounds.map((round, roundIdx) => (
    <BackgroundView style={styles.round} key={roundIdx}>
      {round.title && roundTitleComponent(round.title, roundIdx)}
      <BackgroundView style={styles.seedList}>
        {round.seeds.map((seed, idx) => (
          <BackgroundView key={idx}>
            {renderSeedComponent({
              seed,
              breakpoint: mobileBreakpoint,
              roundIndex: roundIdx,
              seedIndex: idx,
            })}
          </BackgroundView>
        ))}
      </BackgroundView>
    </BackgroundView>
  ));
  return <BackgroundView style={styles.bracket}>{data}</BackgroundView>;
};

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
  let total = 100 + 2 * VerticalMargin;
  let start = 0; //100 * (25 / total);
  let end = 100; //(100 * (total - 25)) / total;
  return (
    <Svg
      style={{ width: svgWidth, height: 93, backgroundColor: "transparent" }}
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
  positionInfo,
  setPositionInfo,
}: {
  seed: RenderSeedProps["seed"];
  breakpoint: RenderSeedProps["breakpoint"];
  roundIndex: RenderSeedProps["roundIndex"];
  seedIndex: RenderSeedProps["seedIndex"];
  tourney: TourneyProps;
  positionInfo: any;
  setPositionInfo: Function;
}) => {
  // ------ assuming rounds is the losers brackets rounds ------
  // losers rounds usually got some identical seeds amount like (2 - 2 - 1 - 1)

  // mobileBreakpoint is required to be passed down to a seed
  const bracket = seed.losers ? "losers" : "winners";
  let rounds = tourney[bracket];

  const isLineConnector: boolean =
    rounds[roundIndex].seeds.length === rounds[roundIndex + 1]?.seeds.length;

  //const Wrapper = isLineConnector ? SingleLineSeed : Seed;
  var [x, y, width, height] = positionInfo[bracket][roundIndex];

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
    <BackgroundView style={{ flexDirection: "row", alignItems: "center" }}>
      <LineComp />
      <BackgroundView
        style={styles.seed}
        onLayout={(event) => {
          let { x, y, width, height } = event.nativeEvent.layout;
          positionInfo[bracket][roundIndex] = [x, y, width, height];
          setPositionInfo(positionInfo);
        }}
      >
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

function TitleComponent(title: React.ReactNode, roundIndex: number) {
  return (
    <BackgroundView
      style={{
        ...styles.container,
        flexDirection: "row",
      }}
    >
      <BackgroundView style={{ width: svgWidth }} />
      <BackgroundView style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </BackgroundView>
      <BackgroundView style={{ minWidth: svgWidth, height: "full" }} />
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

  const [positionInfo, setPositionInfo] = useState({
    winners: new DefaultDict([0, 0, 0, 0]),
    losers: new DefaultDict([0, 0, 0, 0]),
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
      positionInfo: positionInfo,
      setPositionInfo: setPositionInfo,
    });
  }
  return (
    <BackgroundView style={styles.container}>
      <BackgroundView style={styles.container}>
        <SingleElimination
          rounds={tourney.winners}
          roundTitleComponent={TitleComponent}
          renderSeedComponent={seedRenderer}
        />
        <SingleElimination
          rounds={tourney.losers}
          roundTitleComponent={TitleComponent}
          renderSeedComponent={seedRenderer}
        />
      </BackgroundView>
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
    margin: "5%",
    borderRadius: 6,
  },
  seedTeam: {
    padding: "1.5rem 1.5rem",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: "10px",
    marginVertical: "2%",
    flex: 1,
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
    borderRadius: 4,
  },
  separator: {
    marginVertical: 3,
    height: 1,
    width: "100%",
  },
  scoreTextContainer: {
    width: "1.5em",
    height: "1.5em",
    backgroundColor: "#701",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 3,
  },
  text: {
    height: "1em",
  },
  seedTextContainer: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "center",
    flexDirection: "column",
  },
  bracket: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    margin: "5%",
  },
  seedList: {
    margin: 0,
    padding: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
  },
  round: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    width: 300,
  },
});
