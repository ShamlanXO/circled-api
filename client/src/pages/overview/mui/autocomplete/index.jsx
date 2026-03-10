// @mui
import { Card, Container, CardContent } from '@mui/material';
import { Masonry } from '@mui/lab';
// routes
import { PATH_PAGE } from '../../../../routes/paths';
// _mock
import { top100Films, countries } from '../../../../_mock';
// components
import Page from '../../../../components/Page';
import HeaderBreadcrumbs from '../../../../components/HeaderBreadcrumbs';
//
import Sizes from './Sizes';
import ComboBox from './ComboBox';
import FreeSolo from './FreeSolo';
import Checkboxes from './Checkboxes';
import CountrySelect from './CountrySelect';
import MultipleValues from './MultipleValues';
import ControllableStates from './ControllableStates';
import { Block } from '../../Block';

// ----------------------------------------------------------------------

const options = ['Option 1', 'Option 2'];

export default function AutocompleteComponent() {
  return (
    <Page title="Components: Autocomplete">
      <Container>
        <HeaderBreadcrumbs
          heading="Autocomplete"
          links={[{ name: 'Components', href: PATH_PAGE.components }, { name: 'Autocomplete' }]}
          moreLink="https://mui.com/components/autocomplete"
        />
        <Card>
          <CardContent>
            <Masonry columns={{ xs: 3, md: 3 }} spacing={3}>
              <Block title="Combo box">
                <ComboBox options={top100Films} />
              </Block>

              <Block title="Country Select">
                <CountrySelect options={countries} />
              </Block>

              <Block title=" Controllable states">
                <ControllableStates options={options} />
              </Block>

              <Block title="Free solo">
                <FreeSolo options={top100Films} />
              </Block>

              <Block title="Multiple Values">
                <MultipleValues options={top100Films} />
              </Block>

              <Block title="Checkboxes">
                <Checkboxes options={top100Films} />
              </Block>

              <Block title="Sizes">
                <Sizes options={top100Films} />
              </Block>
            </Masonry>
          </CardContent>
        </Card>
      </Container>
    </Page>
  );
}
