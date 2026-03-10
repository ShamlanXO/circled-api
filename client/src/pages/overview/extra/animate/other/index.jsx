import { useState } from 'react';
// @mui
import { Box, Grid, Card, CardContent, IconButton } from '@mui/material';
// components
import Iconify from '../../../../../components/Iconify';
//
import Logo from './Logo';
import Button from './Button';
import { Block } from '../../../Block';

// ----------------------------------------------------------------------

export default function Other() {
  const [count, setCount] = useState(0);

  return (
    <Card>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={6}>
            <Block title="Button Click" sx={{ '& > *': { mx: 1 } }}>
              <Button />
            </Block>
          </Grid>

          <Grid item xs={6}>
            <Block title="Path">
              <Box sx={{ position: 'absolute', right: 0, top: 32 }}>
                <IconButton onClick={() => setCount(count + 1)}>
                  <Iconify icon={'eva:refresh-fill'} width={20} height={20} />
                </IconButton>
              </Box>
              <Logo key={count} />
            </Block>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
