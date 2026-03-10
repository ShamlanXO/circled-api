// @mui

// components

// sections
import { BorderBottom } from '@mui/icons-material'
import {
    Box,
    IconButton,
    Button,
    Stack,
    TextField,
    Typography,
    Card,
    ButtonBase,
} from '@mui/material'

import Iconify from 'src/components/Iconify'
import PendingIcon from 'src/assets/todo/pending'
import DoneIcon from 'src/assets/todo/completed'
import TodoPopover from 'src/components/instructor/TodoPopover'
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

export default function TodoForm(props) {
    let { todo, handleChange, deleteTodo, pushTodo, handleSave, toggleedit } =
        props

    return (
        <Stack spacing={3} sx={{ width: '100%', pb: 2 }}>
            <Stack>
                {todo.map((item, index) => (
                    <Box display={'flex'} key={`${index}`} alignItems="start">
                        <Box flex={1}>
                            {item.edit == true ? (
                                <TextField
                                    variant="outlined"
                                    placeholder="Write a task"
                                    value={item.value}
                                    onChange={(e) =>
                                        handleChange(e.target.value, index)
                                    }
                                    // onBlur={handleBlur}
                                       sx={{mb:1}}
                                    fullWidth
                                    InputProps={{
                                        multiline: true,
                                        endAdornment: (
                                            <ButtonBase
                                                sx={{
                                                    color: 'primary.main',
                                                    fontWeight: 600,
                                                }}
                                                onClick={() => {
                                                    handleSave(index)
                                                }}
                                            >
                                                Done
                                            </ButtonBase>
                                            // <IconButton
                                            //   sx={{ ml: 1 }}
                                            //   onClick={() => {
                                            //     deleteTodo(index);
                                            //   }}
                                            // >
                                            //   <Iconify icon="bx:trash" color="error.main" />
                                            // </IconButton>
                                        ),
                                    }}
                                />
                            ) : (
                                <Box
                                    //onClick={() => toggleedit(index)}
                                    sx={{
                                        py: 2,

                                        display: 'flex',

                                        alignItems: 'flex-start',
                                        mb: 0,
                                        justifyContent: 'space-between',
                                        borderBottom: '1px solid #E1E7F0',
                                    }}
                                >
                                    <Box display={'flex'} alignItems={'center'}>
                                        {item.isDone ? <DoneIcon /> : null}{' '}
                                        &nbsp;&nbsp;
                                        <Typography color={'text.secondary'}>
                                            {item.value}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', pl: 1 }}>
                                        <TodoPopover
                                            onDelete={() => deleteTodo(index)}
                                            onEdit={() => toggleedit(index)}
                                        >
                                            <Iconify
                                                // onClick={(e) => {
                                                //   e.stopPropagation();
                                                //   deleteTodo(index);
                                                // }}
                                                icon={'mdi-light:dots-vertical'}
                                                width={24}
                                                height={24}
                                                color="text.primary"
                                                sx={{ fontSize: 24, ml: 1 }}
                                            />
                                        </TodoPopover>
                                    </Box>
                                </Box>
                            )}
                        </Box>
                        {/* 
            {
              <IconButton
                sx={{ ml: 1 }}
                onClick={() => {
                  deleteTodo(index);
                }}
              >
                <Iconify icon="bx:trash" color="error.main" />
              </IconButton>
            } */}
                    </Box>
                ))}
{todo.length === 0 && <Box py={3} pb={4} justifyContent={"center"} alignItems={"center"} display={"flex"} width={"100%"} >
    <Typography  color="text.secondary">
        No tasks
    </Typography>
</Box>}

                <Box width={'100%'} px={2} mt={2}>
                    <Button
                        // style={{  borderRadius: 10 }}
                        variant="outlined"
                        fullWidth
                        size="small"
                        color={'primary'}
                        sx={{
                            mt: 0,
                            px: 0,
                            fontSize: 18,
                            pl: 0,
                     
                        }}
                        onClick={() => {
                            pushTodo('')
                        }}
                    >
                       Add task
                    </Button>
                </Box>
            </Stack>
        </Stack>
    )
}
