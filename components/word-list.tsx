import { IWord } from "@/lib/interface";
import { color_border, color_table_header } from "@/theme";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

export default function WordList({
  wordList,
  setWordList,
}: {
  wordList: IWord[];
  setWordList?: (wordList: IWord[]) => void;
}) {
  return (
    <TableContainer
      component={Paper}
      style={{
        border: `1px solid ${color_border}`,
        borderRadius: "8px",
        width: "500px",
      }}
    >
      <Table
        style={{
          width: "100%",
        }}
      >
        <TableHead
          style={{
            background: color_table_header,
          }}
        >
          <TableRow>
            <TableCell
              width={120}
              style={{
                borderRight: `1px solid ${color_border}`,
              }}
            >
              <Typography fontWeight={"bold"}>Word</Typography>
            </TableCell>
            <TableCell>
              <Typography fontWeight={"bold"}>Exemplar Usage</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {wordList.map((word, index) => {
            return (
              <TableRow key={index}>
                <TableCell
                  style={{
                    borderRight: `1px solid ${color_border}`,
                    padding: "0px",
                  }}
                >
                  <TextField
                    fullWidth
                    sx={{
                      // Change MuiOutlinedInput's border to 0 width, 0 radius
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 0,
                      },
                    }}
                    value={word.word}
                    onChange={(e) => {
                      if (!setWordList) return;
                      const newWordList = [...wordList];
                      newWordList[index].word = e.target.value;
                      setWordList(newWordList);
                    }}
                  />
                </TableCell>
                <TableCell
                  style={{
                    padding: "0px",
                  }}
                >
                  <TextField
                    fullWidth
                    sx={{
                      // Change MuiOutlinedInput's border to 0 width, 0 radius
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 0,
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderWidth: 0,
                      },
                    }}
                    value={word.exemplarUsage}
                    onChange={(e) => {
                      if (!setWordList) return;
                      const newWordList = [...wordList];
                      newWordList[index].exemplarUsage = e.target.value;
                      setWordList(newWordList);
                    }}
                    multiline
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
