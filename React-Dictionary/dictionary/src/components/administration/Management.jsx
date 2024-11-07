import { Box, Container, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect } from "react";

const Management = ({ setIsLoading }) => {
  useEffect(() => {
    setIsLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box>
      <Container>
        <Grid container spacing={1}>
          <Grid size={5} />
          <Grid size={12}>
            <Skeleton height={14} />
          </Grid>
          <Grid size={12}>
            <Skeleton height={14} />
          </Grid>
          <Grid size={4}>
            <Skeleton height={100} />
          </Grid>
          <Grid size={8}>
            <Skeleton height={100} />
          </Grid>

          <Grid size={12}>
            <Skeleton height={150} />
          </Grid>
          <Grid size={12}>
            <Skeleton height={14} />
          </Grid>
          <Grid size={3}>
            <Skeleton height={100} />
          </Grid>
          <Grid size={3}>
            <Skeleton height={100} />
          </Grid>
          <Grid size={3}>
            <Skeleton height={100} />
          </Grid>
          <Grid size={3}>
            <Skeleton height={100} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Management;
