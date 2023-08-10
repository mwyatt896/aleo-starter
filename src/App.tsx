import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
  Stack,
} from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import {
  useAccount,
  useRecords,
  useConnect,
  useExecuteProgram,
  PuzzleWalletProvider,
} from '@puzzlehq/sdk';
import { PuzzleWeb3Modal } from '@puzzlehq/sdk';
import { useState } from 'react';
import { log } from 'console';

function App() {
  const mdTheme = createTheme();
  const navigate = useNavigate();
  const { connect } = useConnect();
  const { account } = useAccount();
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState(""); 
  const [operation, setOperation] = useState(""); 
  const { records } = useRecords({
    program_id: "priv_pub_m_token_test.aleo",
    type: "unspent",
  });
  console.log(records[0].plaintext.toString());

  const {
    execute,
    loading,
    transactionId,
    outputPrivate,
    outputRecords,
    outputPublic,
    outputConstant,
    error,
  } = useExecuteProgram({
    programId: "priv_pub_m_token_test.aleo", 
    functionName: operation, 
    // Aleo program inputs need their types specified, our program takes in 32 bit integers
    // so the inputs should look like "2i32 3i32"
    inputs: records[0].plaintext.toString().replace(/\n/g, "").replace(/\s/g, "") + " " + address + " " + amount + "u64",
    // inputs: address + amount + "u64",
  });
  console.log(records[0].plaintext.toString().replace(/\n/g, "").replace(/\s/g, "") + " " + address + " " + amount + "u64");
  
  const handleSubmit = (event) => {
    event.preventDefault();
    // Read the form data
    const form = event.target;
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());
    const operation = formJson.operation as string;
    setOperation(operation); 
    execute();
  }
  return (
    <>
      <PuzzleWalletProvider>
        <ThemeProvider theme={mdTheme}>
          {
            <Box sx={{ display: 'flex' }}>
              <CssBaseline />
              <AppBar position='fixed' color='default'>
                <Toolbar>
                  <Typography
                    component='h1'
                    variant='h6'
                    color='inherit'
                    noWrap
                    sx={{ flexGrow: 1 }}
                    style={{ fontSize: '1.7rem', marginLeft: 70 }}
                  >
                    Aleo Starter
                  </Typography>
                  <Button
                    onClick={async () => {
                      await connect();
                    }}
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                    }}
                  >
                    {account?.address ?? 'Connect Puzzle Wallet'}
                  </Button>
                </Toolbar>
              </AppBar>
              <Box
                component='main'
                sx={{
                  backgroundColor: (theme) =>
                    theme.palette.mode === 'light'
                      ? theme.palette.grey[100]
                      : theme.palette.grey[900],
                  flexGrow: 1,
                  height: '100vh',
                  overflow: 'auto',
                }}
              >
                <Toolbar />
                <Container maxWidth={false} sx={{ mt: 4, mb: 4 }}>
                  <form onSubmit={handleSubmit}>
                    <Stack>
                    <label>Enter address 
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </label>
                    <label>Enter amount to transfer to this address 
                      <input
                        type="text"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                      />
                    </label>
                    <select name="operation" defaultValue="addition">
                      <option 
                        value="transfer_private"
                        >Transfer Privately</option>
                        <option 
                        value="transfer_public"
                        >Transfer Publicly</option>
                        <option 
                        value="transfer_private_to_public"
                        >Transfer Private Tokens to a Public Address</option>
                        <option 
                        value="trasnfer_public_to_private"
                        >Transfer Public Tokens to a Private Address</option>
                    </select>
                    <input type="submit" />
                    <Typography>Result</Typography>
                    <Typography> {!outputPrivate || loading ? "Loading" : outputPrivate} </Typography>
                    <Typography> {!outputRecords || loading ? "Loading" : outputRecords} </Typography>
                    </Stack>
                  </form>
                </Container>
              </Box>
            </Box>
          }
        </ThemeProvider>
      </PuzzleWalletProvider>
      <PuzzleWeb3Modal
        dAppName='Puzzle Starter app'
        dAppDescription="Let's Puzzle!"
        dAppUrl='http://localhost:5173'
        dAppIconURL='https://walletconnect.puzzle.online/assets/logo_white-b85ba17c.png'
      />
    </>
  );
}

export default App;
