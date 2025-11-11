"use client";

import EditCodeForm from "@/components/edit-code-form";
import GameSelector from "@/components/game-selector";
import Loading from "@/components/loading";
import WordList from "@/components/word-list";
import {
  color_border,
  color_container_primary,
  color_on_surface,
  color_surface,
} from "@/theme";
import {
  Add,
  Cancel,
  CancelOutlined,
  Clear,
  Close,
  ContentCopy,
  Refresh,
  Update,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Divider,
  IconButton,
  List,
  ListItem,
  Radio,
  Stack,
  Table,
  TextField,
  Typography,
} from "@mui/material";
import { track } from "@vercel/analytics";
import Link from "next/link";
import { notFound, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { BeatLoader } from "react-spinners";

// Premade word list categories - approximately 50 spelling/vocabulary patterns
const PREMADE_WORD_LISTS = [
  "Silent 'w'",
  "Contractions",
  "Prefixes un-/re-",
  "Suffixes -less/-ness",
  "Possessives",
  "Diphthongs (oi/oy)",
  "Silent Letters",
  "Hard 'g'",
  "Soft 'c'",
  "Long Vowels",
  "Short Vowels",
  "Double Consonants",
  "Silent 'e'",
  "Silent 'k'",
  "Silent 'b'",
  "Silent 'h'",
  "Homophones",
  "Compound Words",
  "Prefixes dis-/mis-",
  "Suffixes -ful/-ly",
  "Suffixes -ed/-ing",
  "Blends (bl/br/cl/cr)",
  "Digraphs (ch/sh/th)",
  "R-Controlled Vowels",
  "Diphthongs (ou/ow)",
  "Words ending in -tion",
  "Words ending in -sion",
  "Words with 'ph'",
  "Words with 'qu'",
  "Words with 'wr'",
  "Words with 'kn'",
  "Words with 'gh'",
  "Prefixes pre-/post-",
  "Prefixes in-/im-",
  "Suffixes -able/-ible",
  "Suffixes -er/-est",
  "Plurals -s/-es",
  "Irregular Plurals",
  "Hard 'c'",
  "Soft 'g'",
  "Words with 'ough'",
  "Words with 'eigh'",
  "Three-Letter Blends",
  "Words ending in -le",
  "Words ending in -al",
  "Words ending in -ous",
  "Words ending in -ious",
  "Prefixes over-/under-",
  "Root words",
  "Compound Contractions"
];

const StepOne = ({
  step,
  setStep,
  inspirations,
  setInspirations,
  categories,
  setCategories,
  setSelectedCategory,
  setCustomCategory,
  wordList,
  setWordList,
}: {
  step: number;
  setStep: (step: number) => void;
  inspirations: string[];
  setInspirations: (words: string[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
  setSelectedCategory: (category: number) => void;
  setCustomCategory: (category: string) => void;
  wordList: { word: string; exemplarUsage: string }[];
  setWordList: (wordList: { word: string; exemplarUsage: string }[]) => void;
}) => {
  const [topic, setTopic] = useState("");
  const [displayedWords, setDisplayedWords] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasNewChange, setHasNewChange] = useState(false);

  // Initialize displayed words on mount
  useEffect(() => {
    refreshDisplayedWords();
  }, []);

  // Initialize from existing inspirations if editing
  useEffect(() => {
    if (inspirations.length > 0 && inspirations[0]) {
      setTopic(inspirations[0]);
    }
  }, []);

  // Update inspirations when topic changes
  useEffect(() => {
    if (topic) {
      setInspirations([topic]);
    }
  }, [topic, setInspirations]);

  // Randomly select 10 word list categories from the premade list
  function refreshDisplayedWords() {
    const shuffled = [...PREMADE_WORD_LISTS].sort(() => Math.random() - 0.5);
    setDisplayedWords(shuffled.slice(0, 10));
  }

  // Set topic from pill click and generate words immediately
  async function selectWordList(word: string) {
    setHasNewChange(true);
    setTopic(word);
    setInspirations([word]);
    setCustomCategory(word);

    // Generate words and go to edit screen
    await generateAndShowWords(word);
  }

  // Generate words from topic and show edit screen
  async function generateAndShowWords(category: string) {
    setIsGenerating(true);
    setWordList([]);
    setStep(2);

    try {
      const response = await fetch("/api/genai/word-list", {
        method: "POST",
        body: JSON.stringify({
          examples: [category],
          category: category,
          n: 10,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to generate words");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";
      const words: { word: string; exemplarUsage: string }[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              accumulated += parsed.chunk;

              const lines = accumulated.split('\n');
              for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();
                if (line) {
                  try {
                    const wordObj = JSON.parse(line);
                    if (wordObj.word && wordObj.exemplarUsage) {
                      words.push(wordObj);
                      setWordList([...words]);
                    }
                  } catch (e) {}
                }
              }
              accumulated = lines[lines.length - 1];
            } catch (e) {}
          }
        }
      }

      // Process any remaining accumulated data (the last word)
      if (accumulated.trim()) {
        try {
          const wordObj = JSON.parse(accumulated.trim());
          if (wordObj.word && wordObj.exemplarUsage) {
            words.push(wordObj);
            setWordList([...words]);
          }
        } catch (e) {}
      }

      setIsGenerating(false);
    } catch (error) {
      console.error("Error:", error);
      setIsGenerating(false);
      setStep(1);
      alert("Failed to generate words. Please try again.");
    }
  }

  // Navigate to manual word entry grid
  function goToManualEntry() {
    setInspirations(["Custom Word List"]);
    setCategories([]);
    setSelectedCategory(-1);
    setCustomCategory("Custom");
    setTopic("");
    setWordList([]); // Start with empty list for manual entry
    setStep(2);
  }

  async function generateCategories() {
    if (!topic || topic.trim() === "") {
      throw new Error("Please enter or select a spelling topic.");
    }

    setIsGenerating(true);

    try {
      // call api /api/genai/categories
      const response = await fetch("/api/genai/categories", {
        method: "POST",
        body: JSON.stringify({
          inspirations: [topic],
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Category generation response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Category generation failed:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });
        throw new Error(`Failed to generate categories (${response.status}). Please try again.`);
      }

      const data = await response.json();
      console.log("Categories generated successfully:", data);

      setCategories(data.categories);
      setIsGenerating(false);
    } catch (error) {
      console.error("Error in generateCategories:", error);
      setIsGenerating(false);

      if (error instanceof Error) {
        alert(
          "Sorry, we couldn't generate categories for your topic. This might be due to:\n\n" +
          "• API connection issues\n" +
          "• Invalid topic format\n" +
          "• Server error\n\n" +
          "Please try again or contact support if the problem persists.\n\n" +
          "Error details: " + error.message
        );
      } else {
        alert("An unexpected error occurred. Please try again.");
      }
      throw error;
    }
  }

  return (
    <Stack spacing={"24px"} alignItems={"center"} paddingBottom={"32px"} maxWidth={"800px"}>
      <Typography fontSize={"18px"} textAlign={"center"}>
        Step 1: Enter or select a spelling topic, AI will generate the rest!
      </Typography>

      {/* Topic Field with Next Button */}
      <Stack direction={"row"} width={"100%"} paddingX={"40px"} spacing={"12px"} alignItems={"center"}>
        <TextField
          fullWidth
          sx={{
            background: color_surface,
          }}
          label="Enter a spelling topic (eg. 'short vowels', 'soft c', 'long c')"
          size="small"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            setHasNewChange(true);
          }}
        />
        <Button
          variant="contained"
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            minWidth: "80px",
            height: "40px",
          }}
          onClick={async () => {
            if (!topic || topic.trim() === "") {
              alert("Please enter a spelling topic.");
              return;
            }

            setInspirations([topic]);
            setCustomCategory(topic);
            await generateAndShowWords(topic);
          }}
        >
          Next
        </Button>
      </Stack>

      {/* Premade Word Pills */}
      <Stack width={"100%"} paddingX={"40px"} spacing={"12px"}>
        <Stack direction={"row"} alignItems={"center"} justifyContent={"flex-end"}>
          <Button
            size="small"
            startIcon={<Refresh />}
            style={{
              textTransform: "none",
              color: color_on_surface,
            }}
            onClick={refreshDisplayedWords}
          >
            Refresh
          </Button>
        </Stack>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: "8px",
          }}
        >
          {displayedWords.map((word) => (
            <Button
              key={word}
              variant={topic === word ? "contained" : "outlined"}
              size="small"
              style={{
                textTransform: "none",
                background: topic === word
                  ? color_container_primary
                  : color_surface,
                color: color_on_surface,
                borderColor: color_border,
              }}
              onClick={() => selectWordList(word)}
            >
              {word}
            </Button>
          ))}
        </Box>
      </Stack>

      {/* Add Your Own - Separate Section */}
      <Box width={"100%"} paddingX={"40px"} paddingTop={"16px"}>
        <Typography fontSize={"14px"} fontWeight={"bold"} marginBottom={"8px"}>
          Or manually create your own word list:
        </Typography>
        <Button
          fullWidth
          variant="outlined"
          size="medium"
          startIcon={<Add />}
          style={{
            textTransform: "none",
            color: color_on_surface,
            borderColor: color_border,
            background: color_surface,
            padding: "10px 20px",
            fontSize: "14px",
          }}
          onClick={goToManualEntry}
        >
          Add your own words
        </Button>
      </Box>

      <BeatLoader loading={isGenerating} />
    </Stack>
  );
};

const StepTwo = ({
  step,
  setStep,
  categories,
  selectedCategory,
  setSelectedCategory,
  customCategory,
  setCustomCategory,
  inspirations,
  wordList,
  setWordList,
  gameId,
  setGameId,
  setEditCode,
}: {
  step: number;
  setStep: (step: number) => void;
  categories: string[];
  selectedCategory: number;
  setSelectedCategory: (category: number) => void;
  customCategory: string;
  setCustomCategory: (category: string) => void;
  inspirations: string[];
  wordList: { word: string; exemplarUsage: string }[];
  setWordList: (wordList: { word: string; exemplarUsage: string }[]) => void;
  gameId: string;
  setGameId: (gameId: string) => void;
  setEditCode: (editCode: string) => void;
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [manualWords, setManualWords] = useState<{ word: string; exemplarUsage: string }[]>(
    Array.from({ length: 15 }, () => ({ word: "", exemplarUsage: "" }))
  );
  const [isManualEntryMode, setIsManualEntryMode] = useState(
    wordList.length === 0 && (customCategory === "Custom" || customCategory === "")
  );

  // Manual entry mode - show grid to enter words
  const isManualEntry = isManualEntryMode && wordList.length === 0;

  // Generate sentences for manually entered words
  async function generateSentencesForWords() {
    const validWords = manualWords.filter(w => w.word.trim() !== "");
    if (validWords.length < 3) {
      alert("Please enter at least 3 words.");
      return;
    }

    setIsGenerating(true);
    setWordList([]);

    // Generate title if empty or still "Custom"
    let finalCategory = customCategory;
    if (!customCategory || customCategory.trim() === "" || customCategory === "Custom") {
      try {
        const titleResponse = await fetch("/api/genai/categories", {
          method: "POST",
          body: JSON.stringify({
            inspirations: validWords.map(w => w.word),
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (titleResponse.ok) {
          const titleData = await titleResponse.json();
          if (titleData.categories && titleData.categories.length > 0) {
            finalCategory = titleData.categories[0];
            setCustomCategory(finalCategory);
          }
        }
      } catch (e) {
        console.error("Failed to generate title:", e);
        finalCategory = "Custom Word List";
      }
    }

    try {
      const response = await fetch("/api/genai/word-list", {
        method: "POST",
        body: JSON.stringify({
          examples: validWords.map(w => w.word),
          category: finalCategory || "Custom Word List",
          n: validWords.length,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to generate sentences");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let accumulated = "";
      const words: { word: string; exemplarUsage: string }[] = [];

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        buffer += chunk;
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;

            try {
              const parsed = JSON.parse(data);
              accumulated += parsed.chunk;

              const lines = accumulated.split('\n');
              for (let i = 0; i < lines.length - 1; i++) {
                const line = lines[i].trim();
                if (line) {
                  try {
                    const wordObj = JSON.parse(line);
                    if (wordObj.word && wordObj.exemplarUsage) {
                      words.push(wordObj);
                      setWordList([...words]);
                    }
                  } catch (e) {}
                }
              }
              accumulated = lines[lines.length - 1];
            } catch (e) {}
          }
        }
      }

      // Process any remaining accumulated data (the last word)
      if (accumulated.trim()) {
        try {
          const wordObj = JSON.parse(accumulated.trim());
          if (wordObj.word && wordObj.exemplarUsage) {
            words.push(wordObj);
            setWordList([...words]);
          }
        } catch (e) {}
      }

      setIsGenerating(false);
      setIsManualEntryMode(false); // Exit manual entry mode after generation
    } catch (error) {
      setIsGenerating(false);
      alert("Error generating sentences: " + error);
    }
  }

  // Publish and get game code
  async function publishAndGetCode() {
    if (wordList.length === 0) {
      alert("Please add at least one word.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch("/api/word-list-settings", {
        method: "POST",
        body: JSON.stringify({
          inspirationWords: inspirations,
          categories: categories,
          selectedCategory: selectedCategory,
          customCategory: customCategory,
          wordList: wordList,
        }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      setGameId(data.id);
      setEditCode(data.editCode);
      setIsGenerating(false);
      setStep(3);
    } catch (error) {
      setIsGenerating(false);
      alert("Error publishing: " + error);
    }
  }

  // Manual entry mode - show word grid
  if (isManualEntry) {
    return (
      <Stack spacing={"32px"} alignItems={"center"} paddingBottom={"32px"} width={"100%"} maxWidth={"1200px"}>
        <Box width={"100%"} paddingX={"40px"}>
          <Typography fontSize={"16px"} fontWeight={"bold"} marginBottom={"8px"}>
            List Title
          </Typography>
          <TextField
            fullWidth
            sx={{ background: color_surface }}
            placeholder="Custom Word List"
            size="small"
            value={customCategory === "Custom" ? "" : customCategory}
            onChange={(e) => setCustomCategory(e.target.value || "Custom")}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          />
        </Box>

        <Box width={"100%"} paddingX={"40px"}>
          <Typography fontSize={"20px"} fontWeight={"bold"} marginBottom={"16px"}>
            Enter Your Words (up to 15)
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            {Array.from({ length: 15 }).map((_, index) => (
              <TextField
                key={index}
                sx={{ background: color_surface }}
                placeholder={`Word ${index + 1}`}
                size="medium"
                value={manualWords[index]?.word || ""}
                onChange={(e) => {
                  const newWords = [...manualWords];
                  newWords[index] = { ...newWords[index], word: e.target.value, exemplarUsage: "" };
                  setManualWords(newWords);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                  }
                }}
              />
            ))}
          </Box>

          <Stack direction={"row"} spacing={"16px"}>
            <Button
              variant="contained"
              size="large"
              style={{
                background: color_surface,
                color: color_on_surface,
                textTransform: "none",
                padding: "16px",
                fontSize: "16px",
                minWidth: "120px",
                border: `1px solid ${color_border}`,
              }}
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              style={{
                background: color_container_primary,
                color: color_on_surface,
                textTransform: "none",
                padding: "16px",
                fontSize: "18px",
                fontWeight: "bold",
              }}
              onClick={generateSentencesForWords}
            >
              Generate Sentences
            </Button>
          </Stack>
        </Box>

        <BeatLoader loading={isGenerating} />
      </Stack>
    );
  }

  // Edit mode - show editable word list (same for both AI-generated and manual)
  return (
    <Stack spacing={"24px"} alignItems={"center"} paddingBottom={"32px"}>
      <Typography fontSize={"18px"} fontWeight={"bold"} textAlign={"center"}>
        {customCategory}
      </Typography>

      <Typography fontSize={"14px"} textAlign={"center"} color={"text.secondary"}>
        Click any field below to make edits, then click &apos;Publish&apos; to create your game link
      </Typography>

      {wordList.length > 0 ? (
        <WordList wordList={wordList} setWordList={setWordList} />
      ) : (
        <Typography>Generating words and sentences...</Typography>
      )}

      <Stack direction={"row"} spacing={"16px"}>
        <Button
          variant="contained"
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "120px",
          }}
          onClick={() => setStep(1)}
        >
          Back
        </Button>
        <Button
          variant="contained"
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "200px",
          }}
          onClick={publishAndGetCode}
          disabled={isGenerating || wordList.length === 0}
        >
          Publish & Get Code
        </Button>
      </Stack>

      <BeatLoader loading={isGenerating} />
    </Stack>
  );
};

const StepThree = ({
  gameId,
  editCode,
}: {
  gameId: string;
  editCode: string;
}) => {
  const baseUrl = window.location.origin;
  const gameLink = `${baseUrl}/game?word-list-id=${gameId}`;

  return (
    <Stack
      spacing={"11px"}
      alignItems={"center"}
      paddingTop={"32px"}
      height={"100%"}
    >
      <Typography fontWeight={"bold"} fontSize={24}>
        Share this link with students, perfect for independent practice and repetition
      </Typography>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"4px"}
        paddingLeft={"40px"}
        paddingBottom={"16px"}
        style={{
          borderBottom: `1px solid ${color_border}`,
        }}
      >
        <Link href={gameLink}>
          <Typography>{gameLink}</Typography>
        </Link>

        <IconButton
          onClick={() => {
            navigator.clipboard.writeText(gameLink);
            track("Game link shared");
          }}
        >
          <ContentCopy />
        </IconButton>
      </Stack>
      {editCode !== "" && (
        <>
          <Typography fontWeight={"bold"} fontSize={18} textAlign={"center"}>
            To edit the word list, go to your shared link, find the
            &apos;settings&apos; icon, and enter the following code:
            <br />
            (only shown once - you might want to copy or write down this code)
          </Typography>
          <Stack
            direction={"row"}
            alignItems={"center"}
            spacing={"4px"}
            paddingLeft={"40px"}
          >
            <Typography>{editCode}</Typography>
            <IconButton
              onClick={() => {
                navigator.clipboard.writeText(editCode);
              }}
            >
              <ContentCopy />
            </IconButton>
          </Stack>
        </>
      )}
    </Stack>
  );
};

export default function WordListSettingsPage() {
  const searchParams = useSearchParams();
  const [gameId, setGameId] = useState("");
  const [editCode, setEditCode] = useState("");

  const [step, setStep] = useState(1);
  const [inspirations, setInspirations] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(-1);
  const [customCategory, setCustomCategory] = useState("");
  const [wordList, setWordList] = useState<
    { word: string; exemplarUsage: string }[]
  >([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isWrongToken, setIsWrongToken] = useState(false);
  const [isExpired, setIsExpired] = useState(false);

  // Fill gameId from URL query if given
  useEffect(() => {
    const id = searchParams.get("id");
    const jwt = searchParams.get("token");
    if (!id) {
      setIsLoading(false);
    } else if (!jwt) {
      setIsWrongToken(true);
    } else {
      setGameId(id);
      // check if the token is valid
      fetch(
        `/api/word-list-settings/check-edit-code?id=${id}&token=${jwt}`
      ).then((res) => {
        if (res.status !== 200) {
          // check message
          res.json().then((data) => {
            if (data.message === "Invalid token") {
              setIsWrongToken(true);
            } else if (data.message === "Token expired") {
              setIsExpired(true);
            }
          });
        }
      });
    }
  }, [searchParams]);

  // Fetch game settings if gameId is given
  useEffect(() => {
    if (!isWrongToken && !isExpired && gameId) {
      fetch(`/api/word-list-settings?id=${gameId}`)
        .then((response) => response.json())
        .then((data) => {
          setInspirations(data.inspirationWords);
          setCategories(data.categories);
          setSelectedCategory(data.selectedCategory);
          setCustomCategory(data.customCategory);
          setWordList(data.wordList);
          setIsLoading(false);
        })
        .catch((error) => {
          alert("Error: " + error);
        });
    }
  }, [gameId, isWrongToken, isExpired]);

  if (isWrongToken) {
    return notFound();
  } else if (isExpired) {
    return (
      <Stack
        height={"100%"}
        width={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Stack
          paddingY={"8px"}
          paddingX={"16px"}
          style={{
            background: color_surface,
            position: "relative",
            borderRadius: "8px",
            border: `1px solid ${color_border}`,
          }}
          alignItems={"center"}
          spacing={"8px"}
        >
          <Box width={"260px"}>
            <Typography fontSize={16} fontWeight={"bold"}>
              Your session expired, please enter the edit code again.
            </Typography>
          </Box>

          <EditCodeForm gameId={gameId!} />
        </Stack>
      </Stack>
    );
  } else if (isLoading) {
    return <Loading />;
  }

  return (
    <Stack
      width={"100%"}
      height={"100%"}
      spacing={"32px"}
      alignItems={"center"}
      paddingTop={"108px"}
      overflow={"auto"}
    >
      {step === 1 && (
        <>
          <Typography fontSize={"34px"} fontWeight={"bold"}>
            New Game Settings
          </Typography>
          <Box paddingX={"48px"}>
            <StepOne
              step={step}
              setStep={setStep}
              inspirations={inspirations}
              setInspirations={setInspirations}
              categories={categories}
              setCategories={setCategories}
              setSelectedCategory={setSelectedCategory}
              setCustomCategory={setCustomCategory}
              wordList={wordList}
              setWordList={setWordList}
            />
          </Box>
        </>
      )}
      {step === 2 && (
        <>
          <Typography fontSize={"34px"} fontWeight={"bold"}>
            New Game Settings
          </Typography>
          <Box paddingX={"48px"}>
            <StepTwo
              step={step}
              setStep={setStep}
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              customCategory={customCategory}
              setCustomCategory={setCustomCategory}
              inspirations={inspirations}
              wordList={wordList}
              setWordList={setWordList}
              gameId={gameId}
              setGameId={setGameId}
              setEditCode={setEditCode}
            />
          </Box>
        </>
      )}
      {step === 3 && (
        <>
          <Stack alignItems={"center"}>
            <Confetti recycle={false} numberOfPieces={800} />
            <Typography fontSize={"34px"} fontWeight={"bold"}>
              Congratulations!
            </Typography>
            <Typography fontSize={"24px"} fontWeight={"bold"}>
              Your new game is live.
            </Typography>
          </Stack>
          <StepThree gameId={gameId} editCode={editCode} />
        </>
      )}
    </Stack>
  );
}
