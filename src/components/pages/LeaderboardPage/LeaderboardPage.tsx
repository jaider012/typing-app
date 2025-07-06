import React, { useState, useEffect } from "react";
import { VStack, HStack, Box, Text, Spinner, Center } from "@chakra-ui/react";
import { MainLayout } from "../../templates/MainLayout/MainLayout";
import { ActionButton, UserAvatar } from "../../atoms";
import { MotionBox } from "../../atoms/MotionBox";
import { useTypingService } from "../../../services/typing.service";
import { LeaderboardEntry } from "../../../services/types";

type LeaderboardType = "wpm" | "accuracy" | "score";

const LeaderboardTable: React.FC<{
  entries: LeaderboardEntry[];
  loading: boolean;
  error: string | null;
  type: LeaderboardType;
}> = ({ entries, loading, error, type }) => {
  const getValueDisplay = (entry: LeaderboardEntry, type: LeaderboardType) => {
    switch (type) {
      case "wpm":
        return `${entry.wpm} WPM`;
      case "accuracy":
        return `${entry.accuracy}%`;
      case "score":
        return `${entry.score} pts`;
      default:
        return entry.value.toString();
    }
  };

  const getIcon = (type: LeaderboardType) => {
    switch (type) {
      case "wpm":
        return "⚡";
      case "accuracy":
        return "🎯";
      case "score":
        return "🏆";
      default:
        return "📊";
    }
  };

  if (loading) {
    return (
      <Center p={8}>
        <Spinner size="lg" color="caret" />
      </Center>
    );
  }

  if (error) {
    return (
      <Box p={4} bg="card" borderRadius="md" textAlign="center">
        <Text color="sub" fontFamily="mono">
          Error loading leaderboard: {error}
        </Text>
      </Box>
    );
  }

  if (!entries || entries.length === 0) {
    return (
      <Box p={4} bg="card" borderRadius="md" textAlign="center">
        <Text color="sub" fontFamily="mono">
          No entries found for this leaderboard yet.
        </Text>
      </Box>
    );
  }

  return (
    <VStack gap={3} align="stretch">
      {entries.map((entry, index) => (
        <MotionBox
          key={entry.uid}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Box
            p={4}
            bg="card"
            borderRadius="md"
            border="1px solid"
            borderColor="border"
            _hover={{ borderColor: "caret", transition: "all 0.2s" }}
          >
            <HStack justify="space-between" align="center">
              <HStack gap={4}>
                {/* Rank */}
                <Box
                  w="40px"
                  h="40px"
                  borderRadius="full"
                  bg={index < 3 ? "caret" : "textArea"}
                  color={index < 3 ? "bg" : "main"}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontFamily="mono"
                >
                  {index === 0
                    ? "🥇"
                    : index === 1
                    ? "🥈"
                    : index === 2
                    ? "🥉"
                    : entry.rank}
                </Box>

                {/* Avatar and Name */}
                <HStack gap={3}>
                  <UserAvatar
                    src={entry.photoURL}
                    name={entry.displayName || "Anonymous"}
                    size="sm"
                  />
                  <VStack align="start" gap={0}>
                    <Text
                      fontSize="md"
                      fontWeight="medium"
                      color="main"
                      fontFamily="mono"
                    >
                      {entry.displayName || "Anonymous User"}
                    </Text>
                    <Text fontSize="xs" color="sub" fontFamily="mono">
                      Rank #{entry.rank}
                    </Text>
                  </VStack>
                </HStack>
              </HStack>

              {/* Value */}
              <HStack gap={2}>
                <Text fontSize="lg" color="sub">
                  {getIcon(type)}
                </Text>
                <Text
                  fontSize="xl"
                  fontWeight="bold"
                  color="caret"
                  fontFamily="mono"
                >
                  {getValueDisplay(entry, type)}
                </Text>
              </HStack>
            </HStack>
          </Box>
        </MotionBox>
      ))}
    </VStack>
  );
};

export const LeaderboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<LeaderboardType>("wpm");
  const [wpmData, setWpmData] = useState<LeaderboardEntry[]>([]);
  const [accuracyData, setAccuracyData] = useState<LeaderboardEntry[]>([]);
  const [scoreData, setScoreData] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getWpmLeaderboard, getAccuracyLeaderboard, getScoreLeaderboard } =
    useTypingService();

  useEffect(() => {
    const loadLeaderboards = async () => {
      setLoading(true);
      setError(null);
      try {
        const [wpmResult, accuracyResult, scoreResult] = await Promise.all([
          getWpmLeaderboard(10),
          getAccuracyLeaderboard(10),
          getScoreLeaderboard(10),
        ]);
        
        setWpmData(wpmResult || []);
        setAccuracyData(accuracyResult || []);
        setScoreData(scoreResult || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load leaderboards");
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboards();
  }, [getWpmLeaderboard, getAccuracyLeaderboard, getScoreLeaderboard]);

  const getCurrentLeaderboard = () => {
    switch (activeTab) {
      case "wpm":
        return { data: wpmData, loading, error };
      case "accuracy":
        return { data: accuracyData, loading, error };
      case "score":
        return { data: scoreData, loading, error };
      default:
        return { data: wpmData, loading, error };
    }
  };

  const currentLeaderboard = getCurrentLeaderboard();

  const tabs = [
    { id: "wpm" as LeaderboardType, label: "WPM", icon: "⚡" },
    { id: "accuracy" as LeaderboardType, label: "Accuracy", icon: "🎯" },
    { id: "score" as LeaderboardType, label: "Score", icon: "🏆" },
  ];

  return (
    <MainLayout>
      <VStack gap={8} align="stretch" w="full" maxW="4xl" mx="auto">
        {/* Header */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box textAlign="center" p={6}>
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="main"
              fontFamily="mono"
            >
              🏆 Leaderboards
            </Text>
            <Text fontSize="md" color="sub" fontFamily="mono">
              See how you rank against other typists
            </Text>
          </Box>
        </MotionBox>

        {/* Tab Navigation */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <HStack justify="center" gap={2} mb={6}>
            {tabs.map((tab) => (
              <ActionButton
                key={tab.id}
                variant={activeTab === tab.id ? "solid" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                size="md"
                bg={activeTab === tab.id ? "caret" : "transparent"}
                color={activeTab === tab.id ? "bg" : "main"}
                borderColor="border"
                _hover={{
                  bg: activeTab === tab.id ? "primary.600" : "card",
                }}
              >
                <HStack gap={2}>
                  <Text>{tab.icon}</Text>
                  <Text>{tab.label}</Text>
                </HStack>
              </ActionButton>
            ))}
          </HStack>
        </MotionBox>

        {/* Leaderboard Content */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box>
            <Text
              fontSize="xl"
              fontWeight="bold"
              color="main"
              fontFamily="mono"
              mb={4}
            >
              Top 10 - {tabs.find((tab) => tab.id === activeTab)?.label}
            </Text>

            <LeaderboardTable
              entries={currentLeaderboard.data || []}
              loading={currentLeaderboard.loading}
              error={currentLeaderboard.error}
              type={activeTab}
            />
          </Box>
        </MotionBox>

        {/* Info */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Box p={4} bg="card" borderRadius="md" textAlign="center">
            <Text fontSize="sm" color="sub" fontFamily="mono">
              💡 Complete typing tests to appear on the leaderboards!
            </Text>
          </Box>
        </MotionBox>
      </VStack>
    </MainLayout>
  );
};
