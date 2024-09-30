import { Card, Grid, Stack, Typography } from "@mui/material";

export default function ProductNewEditForm() {
  const onSubmit = async () => {};

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card sx={{ mt: 3 }}>
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "text.secondary", mx: 1 }}
                >
                  Description
                </Typography>

                {/* <RHFEditor simple name="description" /> */}
              </Stack>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
