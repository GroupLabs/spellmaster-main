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

const StepOne = ({
  step,
  setStep,
  inspirations,
  setInspirations,
  categories,
  setCategories,
}: {
  step: number;
  setStep: (step: number) => void;
  inspirations: string[];
  setInspirations: (words: string[]) => void;
  categories: string[];
  setCategories: (categories: string[]) => void;
}) => {
  const [numWords, setNumWords] = useState(3);
  const [exampleWords, setExampleWords] = useState<string[]>([]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [hasNewChange, setHasNewChange] = useState(false);

  useEffect(() => {
    setExampleWords(inspirations);
    setNumWords(Math.max(3, inspirations.length));
  }, []);

  useEffect(() => {
    // compare curList and inspirations element-wise
    if (
      numWords !== inspirations.length ||
      exampleWords.some((value, index) => value !== inspirations[index])
    ) {
      setInspirations(exampleWords);
    }
  }, [numWords, exampleWords, setInspirations]);

  async function generateCategories() {
    if (inspirations.length < 3 || exampleWords.some((word) => word === "")) {
      throw new Error("Please enter at least three words.");
    }

    setIsGenerating(true);

    // call api /api/genai/categories
    await fetch("/api/genai/categories", {
      method: "POST",
      body: JSON.stringify({
        inspirations: inspirations,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCategories(data.categories);
        setIsGenerating(false);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }

  return (
    <Stack spacing={"11px"} alignItems={"center"} paddingBottom={"32px"}>
      <Typography fontSize={"18px"}>
        Step 1: Enter three or more vocabulary words from your list, AI will generate the rest!
      </Typography>
      {
        // Create nWords number of text fields
        Array.from({ length: numWords }).map((_, index) => (
          <Box
            key={index}
            paddingLeft={"40px"}
            paddingRight={index < 3 ? "40px" : "0px"}
          >
            <TextField
              sx={{
                background: color_surface,
              }}
              label={`Word ${index + 1}`}
              size="small"
              value={exampleWords[index]}
              onChange={(e) => {
                setHasNewChange(true);
                const newWords = [...exampleWords];
                newWords[index] = e.target.value;
                setExampleWords(newWords);
              }}
            />
            {index >= 3 && (
              <IconButton
                tabIndex={-1}
                onClick={() => {
                  setHasNewChange(true);
                  const newWords = [...exampleWords];
                  newWords.splice(index, 1);
                  setNumWords(numWords - 1);
                  setExampleWords(newWords);
                }}
              >
                <Close />
              </IconButton>
            )}
          </Box>
        ))
      }
      <Button
        style={{
          textTransform: "none",
          color: color_on_surface,
        }}
        onClick={() => {
          if (numWords < 10) {
            setNumWords(numWords + 1);
          } else {
            alert("You can only enter up to 10 words.");
          }
        }}
      >
        <Add />
        add more vocabulary words
      </Button>
      <Stack direction={"row"}>
        <Button
          variant="contained"
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "80px",
          }}
          onClick={() => {
            if (categories.length === 0 || hasNewChange) {
              generateCategories()
                .then(() => {
                  setHasNewChange(false);
                  setStep(step + 1);
                })
                .catch((error) => {
                  alert(error);
                });
            } else {
              setStep(step + 1);
            }
          }}
        >
          Next
        </Button>
      </Stack>
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
}) => {
  // const [category, setCategory] = useState(-1);
  const [radioDisabled, setRadioDisabled] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);

  const [hasNewChange, setHasNewChange] = useState(false);

  async function generateWordList() {
    if (selectedCategory === -1 && customCategory === "") {
      throw new Error("Please select a category or enter a custom category.");
    }

    setIsGenerating(true);

    // call api /api/genai/word-list
    await fetch("/api/genai/word-list", {
      method: "POST",
      body: JSON.stringify({
        examples: inspirations,
        category:
          customCategory !== "" ? customCategory : categories[selectedCategory],
        n: 10,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setWordList(data.wordList);
        setIsGenerating(false);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }

  function setCategoryIndex(index: number) {
    if (selectedCategory === index) {
      // Unselect the category
      setSelectedCategory(-1);
    } else {
      setSelectedCategory(index);
    }
  }

  useEffect(() => {
    if (customCategory !== "") {
      setRadioDisabled(true);
    } else {
      setRadioDisabled(false);
    }
  }, [customCategory, setRadioDisabled]);

  return (
    <Stack spacing={"11px"} alignItems={"center"}>
      <Typography fontSize={"18px"}>
        Step 2: Select the category that best matches your learning objectives
      </Typography>
      <Stack width={"100%"} paddingX={"16px"}>
        <List
          disablePadding
          style={{
            border: `1px solid ${color_border}`,
            borderRadius: "8px",
            width: "100%",
            background: color_surface,
          }}
        >
          {categories.map((category, index) => (
            <>
              <ListItem
                key={index}
                disablePadding
                style={{
                  paddingRight: "16px",
                }}
              >
                <Stack direction={"row"} alignItems={"center"}>
                  <Radio
                    disabled={radioDisabled}
                    checked={selectedCategory === index}
                    onClick={() => {
                      setCategoryIndex(index);
                      setHasNewChange(true);
                    }}
                  />
                  <Typography>{category}</Typography>
                </Stack>
              </ListItem>
              {
                // Add divider if not the last item
                index !== categories.length - 1 && <Divider />
              }
            </>
          ))}
        </List>
        <TextField
          sx={{
            background: color_surface,
            marginTop: "16px",
          }}
          label={"Custom Category"}
          InputLabelProps={{
            shrink: true,
          }}
          placeholder={"Not quite right? Add your own!"}
          size="small"
          value={customCategory}
          onChange={(e) => {
            setSelectedCategory(-1);
            setCustomCategory(e.target.value);
            setHasNewChange(true);
          }}
          InputProps={{
            endAdornment: (
              <IconButton
                disabled={customCategory === ""}
                onClick={() => setCustomCategory("")}
              >
                <Clear />
              </IconButton>
            ),
          }}
        />
      </Stack>
      <Stack direction={"row"} spacing={"16px"}>
        <Button
          variant="contained"
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "80px",
          }}
          onClick={() => setStep(step - 1)}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "80px",
          }}
          onClick={() => {
            if (wordList.length === 0 || hasNewChange) {
              generateWordList()
                .then(() => {
                  setHasNewChange(false);
                  setStep(step + 1);
                })
                .catch((error) => {
                  alert(error);
                });
            } else {
              setStep(step + 1);
            }
          }}
        >
          Next
        </Button>
      </Stack>
      <BeatLoader loading={isGenerating} />
    </Stack>
  );
};

const StepThree = ({
  step,
  setStep,
  inspirations,
  categories,
  selectedCategory,
  customCategory,
  wordList,
  setWordList,
  gameId,
  setGameId,
  setEditCode,
}: {
  step: number;
  setStep: (step: number) => void;
  inspirations: string[];
  categories: string[];
  selectedCategory: number;
  customCategory: string;
  wordList: { word: string; exemplarUsage: string }[];
  setWordList: (wordList: { word: string; exemplarUsage: string }[]) => void;
  gameId: string;
  setGameId: (gameId: string) => void;
  setEditCode: (editCode: string) => void;
}) => {
  const [isRegen, setIsRegen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  async function generateLinks() {
    if (wordList.length === 0) {
      throw new Error("Please generate word list first.");
    }

    setIsGenerating(true);

    await fetch("/api/word-list-settings", {
      method: "POST",
      body: JSON.stringify({
        inspirationWords: inspirations,
        categories: categories,
        selectedCategory: selectedCategory,
        customCategory: customCategory,
        wordList: wordList,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setGameId(data.id);
        setEditCode(data.editCode);
        setIsGenerating(false);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }

  async function reGenerateWordList() {
    setIsRegen(true);

    // call api /api/genai/word-list
    await fetch("/api/genai/word-list", {
      method: "POST",
      body: JSON.stringify({
        examples: inspirations,
        category:
          customCategory !== "" ? customCategory : categories[selectedCategory],
        n: 10,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setWordList(data.wordList);
        setIsRegen(false);
      })
      .catch((error) => {
        alert("Error: " + error);
      });
  }

  async function updateWordListSettings() {
    setIsGenerating(true);
    await fetch("/api/word-list-settings", {
      method: "PATCH",
      body: JSON.stringify({
        id: gameId,
        inspirationWords: inspirations,
        categories: categories,
        selectedCategory: selectedCategory,
        customCategory: customCategory,
        wordList: wordList,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    setIsGenerating(false);
  }

  return (
    <Stack spacing={"11px"} alignItems={"center"}>
      <Typography fontSize={"18px"}>
        Final Step: Click below to make any final edits, then click
        &apos;Publish&apos; to create your game link
      </Typography>

      {isRegen ? (
        <Stack alignItems={"center"} spacing={"16px"}>
          <Typography fontSize={"18px"}>Regenerating word list...</Typography>
          <BeatLoader loading={true} />
        </Stack>
      ) : (
        <WordList wordList={wordList} setWordList={setWordList} />
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
          onClick={() => {
            reGenerateWordList().catch((error) => {
              alert(error);
            });
          }}
        >
          Re-generate
        </Button>
        <Button
          variant="contained"
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "120px",
          }}
          onClick={() => setStep(step - 1)}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          style={{
            background: color_container_primary,
            color: color_on_surface,
            textTransform: "none",
            width: "120px",
          }}
          onClick={() => {
            if (gameId === "") {
              generateLinks()
                .then(() => {
                  setStep(step + 1);
                })
                .catch((error) => {
                  alert(error);
                });
            } else {
              updateWordListSettings().then(() => {
                setStep(step + 1);
              });
            }
          }}
        >
          Publish
        </Button>
      </Stack>
      <Stack alignItems={"center"} paddingTop={"48px"}>
        <Typography>
          Once published, share the link with your students for individual practice with the games below
        </Typography>
        <GameSelector />
      </Stack>
      <BeatLoader loading={isGenerating} />
    </Stack>
  );
};

const StepFour = ({
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
            />
          </Box>
        </>
      )}
      {step === 3 && (
        <>
          <Typography fontSize={"34px"} fontWeight={"bold"}>
            {selectedCategory === -1
              ? customCategory
              : categories[selectedCategory]}
          </Typography>
          <Box paddingX={"48px"} paddingBottom={"32px"}>
            <StepThree
              step={step}
              setStep={setStep}
              inspirations={inspirations}
              categories={categories}
              selectedCategory={selectedCategory}
              customCategory={customCategory}
              wordList={wordList}
              setWordList={setWordList}
              gameId={gameId}
              setGameId={setGameId}
              setEditCode={setEditCode}
            />
          </Box>
        </>
      )}

      {step === 4 && (
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
          <StepFour gameId={gameId} editCode={editCode} />
        </>
      )}
    </Stack>
  );
}
