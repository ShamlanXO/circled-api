import { Box, Typography ,Grid, Slider,Stack,TextField,InputAdornment,Chip} from '@mui/material'
import { useState } from 'react'

import {  useSelector } from 'react-redux'

import MaskedInput from 'src/components/core/MaskedInput'
import { length, mass } from 'units-converter'
import BodyComposition from 'src/assets/IconSet/fitnessProfile/BodyComposition'

import EditDrawer from 'src/components/common/EditDrawerWithCustomView'



// ----------------------------------------------------------------------

export default function BodyMetrix({ data, setData,viewMode=false}) {
  
   
    const setHealtInfo = (att, value) => {
        setData({ ...data, [att]: value })
    }

    
  
    const [unitFormatWeight, setUnitFormatWeight] = useState(0)
    const [unitFormatHeight, setUnitFormatHeight] = useState(0)
    return (

                        <Box bgcolor={"#fff"}>
                          
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Box display={"flex"} alignItems={"flex-end"} justifyContent={"space-between"}>
                                    <EditDrawer
                                    viewMode ={viewMode}
                                     view={<Box display={'flex'}>
                               
                               <Box>
                                   <Typography
                                       sx={{ fontWeight: 'bold' }}
                                       variant="body1"
                                       color="text.primart"
                                       gutterBottom
                                   >
                                       Height
                                   </Typography>
                                   <Box justifyContent={"flex-end"}>
                                   <TextField 
                                    size='small'
                                    sx={{width:100}}
                                   value={Number(data.height) > 0
                                       ? Number(
                                             unitFormatHeight == 0
                                                 ? data.height
                                                 : length(
                                                       Number(data.height)
                                                   )
                                                       .from('cm')
                                                       .to('ft').value
                                         ).toFixed(unitFormatHeight == 0?0:2)
                                       : 0}
                                       InputProps={{
                                        readOnly: true,
                                           endAdornment: (
                                               <InputAdornment position="end">
                                                   {unitFormatHeight == 0
                                                       ? 'cm'
                                                       : 'ft'}
                                               </InputAdornment>
                                           ),
                                       }}
                                      
                                       />


                                   </Box>
                                
                                   
                                   </Box>
                                </Box>
                                   
                                   }
                                    title="Height"
                                    field={
                                        <Stack width={"100%"} spacing={3}>
                                            <Typography align='center' gutterBottom variant='h1'>
{  Number(data.height) > 0
                                                ? Number(
                                                    unitFormatHeight == 0
                                                          ? data.height
                                                          : length(
                                                                Number(
                                                                    data.height
                                                                )
                                                            )
                                                                .from(
                                                                    'cm'
                                                                )
                                                                .to(
                                                                    'ft'
                                                                ).value
                                                  ).toFixed(unitFormatHeight == 0?0:2)
                                                : 0}

{unitFormatHeight == 0?'cm':'ft'}
                                            </Typography>
                                        <Slider
                                        max={unitFormatHeight == 0?300:8}
                                        min={unitFormatHeight == 0?100:3}
                                        step={unitFormatHeight == 0?1:0.1}
                                        size='medium'
                                        valueLabelDisplay="auto"
                                        valueLabelFormat={(valuetext)=>`${valuetext}${unitFormatWeight == 0?'cm':'ft'}`}
                                      
                                        defaultValue={
                                            Number(data.height) > 0
                                                ? Number(
                                                    unitFormatHeight == 0
                                                          ? data.height
                                                          : length(
                                                                Number(
                                                                    data.height
                                                                )
                                                            )
                                                                .from(
                                                                    'cm'
                                                                )
                                                                .to(
                                                                    'ft'
                                                                ).value
                                                  ).toFixed(unitFormatHeight == 0?0:2)
                                                : 0
                                        }

                                        onChange={(e,num) =>
                                            setHealtInfo(
                                                'height',
                                                unitFormatHeight == 0
                                                    ? num
                                                    : length(
                                                          Number(
                                                            num
                                                          )
                                                      )
                                                          .from('ft')
                                                          .to('cm')
                                                          .value
                                            )
                                        }

                                        />
                                        

                                        </Stack>
                                   }

                                    />
                                        <Stack direction={"row"} spacing={2}>
                                        <Chip sx={{fontSize:18 , fontWeight:unitFormatHeight == 0?"bold":"300",width:80,mb:0.5,color:unitFormatHeight == 0?undefined:"grey.400"}} variant={unitFormatHeight == 0?'filled':'outlined'} color={unitFormatHeight == 0?"primary":undefined} label="Cm" onClick={()=>setUnitFormatHeight(unitFormatHeight == 0?1:0)}  />
                                        <Chip sx={{fontSize:18 , 
                                            fontWeight:unitFormatHeight == 1?"bold":"300",
                                            width:80,mb:0.5,color:unitFormatHeight == 1?undefined:"grey.400"}} variant={unitFormatHeight == 1?'filled':'outlined'} color={unitFormatHeight == 1?"primary":undefined} label="Inch" onClick={()=>setUnitFormatHeight(unitFormatHeight == 0?1:0)}  />
                                        </Stack>
                                    </Box>
                                  
                                    
                                    
                                </Grid>
                 <Grid item xs={12}>
                 <Box display={"flex"} alignItems={"flex-end"} justifyContent={"space-between"}>
                   <EditDrawer
                   viewMode={viewMode}
                    view={<Box display={'flex'} >
                     <Box>
                          <Typography
                            sx={{ fontWeight: 'bold' }}
                            variant="body1"
                            color="text.primart"
                            gutterBottom
                          >
                            Weight
                          </Typography>
                       <TextField 
                       sx={{width:100}}
                       size='small'
                          value={Number(data.weight) > 0
                            ? Number(
                                  unitFormatWeight == 0
                                    ? data.weight
                                    : mass(
                                            Number(data.weight)
                                      )
                                            .from('kg')
                                            .to('lb').value
                                ).toFixed(unitFormatWeight == 0?1:0)
                            : 0}
                            InputProps={{
                                readOnly: true,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {unitFormatWeight == 0
                                            ? 'kg'
                                            : 'lbs'}
                                    </InputAdornment>
                                ),
                            }}
                           
                            />
                          </Box>
                   </Box>
                     }
                        title="Weight"
                        field={
                            <Stack width={"100%"} spacing={3}>
                            <Typography align='center' gutterBottom variant='h1'>
                            {Number(data.weight) > 0
                                  ? Number(
                                          unitFormatWeight == 0
                                            ? data.weight
                                            : mass(
                                                    Number(data.weight)
                                              )
                                                    .from('kg')
                                                    .to('lb').value
                                     ).toFixed(unitFormatWeight == 0?1:0)
                                  : 0}
                                  {
                                        unitFormatWeight == 0
                                         ? ' kg'
                                         : ' lbs'
                                  }


                            </Typography>
                            <Slider
                            max={unitFormatWeight == 0?200:400}
                            min={unitFormatWeight == 0?30:100}
                            step={unitFormatWeight == 0?0.5:1}
                            size='medium'
                            valueLabelDisplay="auto"
                            valueLabelFormat={(valuetext)=>`${valuetext}${unitFormatWeight == 0?'kg':'lb'}`}
                          
                            defaultValue={
                                Number(data.weight) > 0
                                            ? Number(
                                                unitFormatWeight == 0
                                                    ? data.weight
                                                    : mass(
                                                            Number(data.weight)
                                                        )
                                                            .from('kg')
                                                            .to('lb').value
                                            ).toFixed(2)
                                            : 0
                                    }
                                    placeholder={'0 kg'}
                                    suffix={
                                        unitFormatWeight == 0
                                            ? ' kg'
                                            : ' lbs'
                            }

                            onChange={(e,num) =>
                                        setHealtInfo(
                                        'weight',
                                        unitFormatWeight == 0
                                            ?num
                                            : mass(
                                                Number(num)
                                            )
                                                .from('lb')
                                                .to('kg')
                                                .value
                                    )
                            }

                            />
                            </Stack>

                            // <MaskedInput
                            //     value={
                            //         Number(data.weight) > 0
                            //             ? Number(
                            //                 unitFormatWeight == 0
                            //                     ? data.weight
                            //                     : mass(
                            //                             Number(data.weight)
                            //                         )
                            //                             .from('kg')
                            //                             .to('lb').value
                            //             ).toFixed(2)
                            //             : 0
                            //     }
                            //     placeholder={'0 kg'}
                            //     suffix={
                            //         unitFormatWeight == 0
                            //             ? ' kg'
                            //             : ' lbs'
                            //     }
                            //     sx={{ width: 'auto' }}
                            //     onChange={(e) =>
                            //         setHealtInfo(
                            //             'weight',
                            //             unitFormatWeight == 0
                            //                 ? e.target.value
                            //                 : mass(
                            //                     Number(e.target.value)
                            //                 )
                            //                     .from('lb')
                            //                     .to('kg')
                            //                     .value
                            //         )
                            //     }
                            // />
                        }
                    />
                      <Stack direction={"row"} spacing={2}>
                                        <Chip sx={{fontSize:18 , fontWeight:unitFormatHeight == 0?"bold":"300",width:80,mb:0.5, color:unitFormatWeight == 0?undefined:"grey.400"}} variant={unitFormatWeight == 0?'filled':'outlined'} color={unitFormatWeight == 0?"primary":undefined} label="Kg" onClick={()=>setUnitFormatWeight(unitFormatWeight == 0?1:0)}  />
                                        <Chip sx={{fontSize:18 , fontWeight:unitFormatHeight == 1?"bold":"300",width:80,mb:0.5 , color:unitFormatWeight == 1?undefined:"grey.400"}} variant={unitFormatWeight == 1?'filled':'outlined'} color={unitFormatWeight == 1?"primary":undefined} label="Lbs" onClick={()=>setUnitFormatWeight(unitFormatWeight == 0?1:0)}  />
                                        </Stack>
                    </Box>
               </Grid>

  {/* 
               <Grid item xs={3}>
                        
                        <EditDrawer
                           viewMode={viewMode}
                         view={<Box display={'flex'}>

                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    display: 'flex',
                                }}

                                variant="body1"

                                color="text.primary"
                                gutterBottom
                            >
                            &nbsp; &nbsp;    Fat % &nbsp; &nbsp;
                                
                            </Typography>

                            <Typography variant="body1" align='center' color="text.secondary">
                                {data?.bodyFat||"00"}%
                            </Typography>
                        </Box>
                        </Box>
                        }
                        title="Body Fat"
                        field={
                            <MaskedInput

                                value={data.bodyFat}    
                                placeholder={'0%'}
                                suffix={' %'}
                                onChange={(e) =>
                                    setHealtInfo(
                                        'bodyFat',
                                        e.target.value
                                    )
                                }
                            />
                        }
                    />
                </Grid>
                <Grid item xs={3}>
                    <EditDrawer 
                       viewMode={viewMode}
                    view={<Box display={'flex'}>
                        <Box>
                            <Typography
                                sx={{
                                    fontWeight: 'bold',
                                    display: 'flex',
                                }}
                                variant="body1"
                                color="text.primary"
                                gutterBottom
                            >
                                Lean Mass
                               
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                {Number(data.leanMass) > 0
                                    ? Number(
                                            unitFormatWeight == 0
                                                ? data.leanMass 
                                                : mass(
                                                        Number(data.leanMass)
                                                    )
                                                        .from('kg') 
                                                        .to('lb').value
                                        ).toFixed(2)
                                    : 0}
                                    {
                                        unitFormatWeight == 0
                                            ? ' kg'
                                            : ' lbs'
                                    }
                            </Typography>
                        </Box>
                    </Box>
                    }
                    title="Lean Mass"
                    field={
                        <MaskedInput
                            value={
                                Number(data.leanMass) > 0
                                    ? Number(
                                        unitFormatWeight == 0
                                            ? data.leanMass
                                            : mass(
                                                    Number(data.leanMass)
                                                )
                                                    .from('kg')
                                                    .to('lb').value
                                    ).toFixed(2)
                                    : 0
                            }
                            placeholder={'0 kg'}
                            suffix={
                                unitFormatWeight == 0
                                    ? ' kg'
                                    : ' lbs'
                            }
                            sx={{ width: 'auto' }}
                            onChange={(e) =>
                                setHealtInfo(
                                    'leanMass',
                                    unitFormatWeight == 0
                                        ? e.target.value
                                        : mass(
                                                Number(e.target.value)
                                            )
                                                .from('lb')
                                                .to('kg')
                                                .value
                                )
                            }
                        />

                    }
                />
            </Grid>
                     */}


                                    


                               
                            </Grid>
                        </Box>
                     
    )
}
