import React from "react";
import { Box, Card, CardContent, Grid } from "@mui/material";
import { getUserInfo } from "../../components/auth/RequireAuth";
import Layout from "../../layout/Layout";

const Home = () => {
  const user = getUserInfo();

  return (
    <Layout type="home">
      <Box sx={{ flexGrow: 1, padding: 2, pt: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Card variant="outlined" sx={{ borderColor: "transparent" }}>
              <CardContent sx={{ pt: 0 }}>
                <Box
                  sx={{
                    textAlign: "end",
                    backgroundColor: "grey.100",
                    p: 0,
                  }}
                >                 
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Layout>
  );
};

export default Home;
