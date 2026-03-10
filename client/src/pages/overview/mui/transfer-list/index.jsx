// @mui
import { styled } from '@mui/material/styles';
import { Box, Container, Stack } from '@mui/material';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
//
import { Block } from '../../Block';
import SimpleTransferList from './SimpleTransferList';
import EnhancedTransferList from './EnhancedTransferList';

// ----------------------------------------------------------------------

const style = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexWrap: 'wrap',
};

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(11),
  paddingBottom: theme.spacing(15),
}));

// ----------------------------------------------------------------------

export default function TransferListComponent() {
  return (
    <Page title="Components: Transfer List">
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
              heading="Transfer List"
              links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Transfer List' }]}
              moreLink="https://mui.com/components/transfer-list"
            />
          </Container>
        </Box>

        <Container>
          <Stack spacing={3}>
            <Block title="Simple" sx={style}>
              <SimpleTransferList />
            </Block>

            <Block title="Enhanced" sx={style}>
              <EnhancedTransferList />
            </Block>
          </Stack>
        </Container>
      </RootStyle>
    </Page>
  );
}
