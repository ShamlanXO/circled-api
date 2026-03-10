// @mui
import { styled } from '@mui/material/styles';
import { Box, Card, Container, CardHeader, Stack } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
//
import BasicTable from './BasicTable';
import CollapsibleTable from './collapsible-table';
import SortingSelecting from './sorting-selecting';
import GroupingFixedHeader from './GroupingFixedHeader';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15),
}));

export default function TableComponent() {
  return (
    <Page title="Components: Table">
      <RootStyle>
        <Box
          sx={{
            pt: 6,
            pb: 1,
            mb: 10,
            bgcolor: (theme) => (theme.palette.mode === 'light' ? 'grey.200' : 'grey.800'),
          }}
        >
          <Container>
            <HeaderBreadcrumbs
              heading="Table"
              links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Table' }]}
              moreLink="https://mui.com/components/tables"
            />
          </Container>
        </Box>

        <Container>
          <Stack spacing={3}>
            <Card>
              <CardHeader title="Basic Table" />
              <BasicTable />
            </Card>

            <Card>
              <SortingSelecting />
            </Card>

            <Card>
              <CardHeader title="Grouping & FixedHeader" />
              <GroupingFixedHeader />
            </Card>

            <Card>
              <CardHeader title="Collapsible Table" />
              <CollapsibleTable />
            </Card>
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}
