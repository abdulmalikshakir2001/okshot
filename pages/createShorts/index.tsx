import React, { useState } from 'react';
import { Container, Grid, Typography, Box, Button, MenuItem, Select, InputLabel, FormControl, TextField, Slider, Switch, FormControlLabel } from '@mui/material';
import AddIcon from '@mui/icons-material/Add'; 
import LanguageIcon from '@mui/icons-material/Language';
import TimerIcon from '@mui/icons-material/Timer';

const durationOptions = [
  { value: '1min', label: '1 min' },
  { value: '2min', label: '2 min' },
  { value: '3min', label: '3 min' },
  { value: '5min', label: '5 min' },
];

const languageOptions = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
];

const CreateShortPage = () => {
  const [timeFrameRange, setTimeFrameRange] = useState([1, 5]);
  const [duration, setDuration] = useState('1min');
  const [language, setLanguage] = useState('en');
  const [aiInstructions, setAiInstructions] = useState('');
  const [toggleStates, setToggleStates] = useState({
    toggle1: false,
    toggle2: false,
    toggle3: false,
    toggle4: false,
    toggle5: false,
  });

  const handleSliderChange = (event, newValue) => {
    setTimeFrameRange(newValue);
  };

  const handleDurationChange = (event) => {
    setDuration(event.target.value);
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  const handleAiInstructionsChange = (event) => {
    setAiInstructions(event.target.value);
  };

  const handleToggleChange = (event) => {
    setToggleStates(prevState => ({
      ...prevState,
      [event.target.name]: event.target.checked
    }));
  };

  const handleCreateShort = () => {
    console.log({
      duration,
      language,
      aiInstructions,
      timeFrameRange,
      toggleStates,
    });
    alert("duration: \t" + duration + 
      " \nlangauge: \t" + language +
      " \nai Instructions: \t" + aiInstructions +
      " \nTime Frame Range: \t" + timeFrameRange +
      " \nToggle States button1: \t" + toggleStates.toggle1 +
      " \nToggle States button2: \t" + toggleStates.toggle2 +
      " \nToggle States button3: \t" + toggleStates.toggle3 +
      " \nToggle States button4: \t" + toggleStates.toggle4 +
      " \nToggle States button5: \t" + toggleStates.toggle5
    )
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, backgroundColor: 'white', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h4" gutterBottom>
        Create Short
      </Typography>
      
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">Video Preview</Typography>
            <Box sx={{ mt: 2 }}>
              <video
                width="100%"
                controls
                src="video.mp4"
                style={{ borderRadius: '8px' }}
              >
                Your browser does not support the video tag.
              </video>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 2,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">Moment Duration</Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel >Duration</InputLabel>
              <Select
                value={duration}
                onChange={handleDurationChange}
                // sx={{ color: 'white' }}
                label="Duration"
              >
                {durationOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Typography variant="subtitle1" sx={{ mt: 2 }}>
              AI Instructions (Optional)
            </Typography>
            <TextField
              multiline
              rows={4}
              placeholder="Enter AI instructions here..."
              value={aiInstructions}
              onChange={handleAiInstructionsChange}
              sx={{ mt: 2, backgroundColor: 'white',  }}
              fullWidth
            />
          </Box>
        </Grid>
      </Grid>

      {/* New Grid Section */}
      <Grid container spacing={2} sx={{ mt: 4 }}>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              p: 2,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">
              <TimerIcon sx={{ mr: 1 }} /> Process Time Frame
            </Typography>
            <Box sx={{ width: '100%', mt: 2 }}>
              <Slider
                value={timeFrameRange}
                onChange={handleSliderChange}
                aria-labelledby="time-frame-slider"
                step={1}
                marks
                min={1}
                max={10}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value} min`}
                sx={{ mb: 2 }}
                getAriaValueText={(value) => `${value} min`}
              />
              <Typography
                variant="body1"
                sx={{
                  textShadow: '1px 1px 2px gray, 0 0 25px gray, 0 0 5px gray',
                }}
              >
                Duration: {timeFrameRange[0]} min - {timeFrameRange[1]} min
              </Typography>
            </Box>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 2,
              borderRadius: 1,
              textAlign: 'center',
            }}
          >
            <Typography variant="h6">
              <LanguageIcon sx={{ mr: 1 }} /> Select Language
            </Typography>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel sx={{}}>Language</InputLabel>
              <Select
                value={language}
                onChange={handleLanguageChange}
                // sx={{ color: 'white' }}
                label="Language"
              >
                {languageOptions.map(option => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Button
          variant="contained"
          color="primary"
          sx={{ width: '200px', fontSize: '16px', padding: '10px 20px' }} 
          startIcon={<AddIcon />}
          onClick={handleCreateShort} 
        >
          Create Short
        </Button>
      </Box>

      <Box sx={{ mt: 4, textAlign: 'center', position: 'relative', mb: 4 }}>
  <Typography variant="h6" sx={{
    position: 'absolute',
    backgroundColor: 'white',
    padding: '0 10px',
    display: 'inline-block',
    top: '-0.0rem',
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 1, 
  }}>
    Advanced
  </Typography>
  <Box sx={{ mt: 2, p: 2, border: '1px solid gray', borderRadius: 1, backgroundColor: 'white' }}>
    {Object.keys(toggleStates).map((key, index) => (
      <Box key={key} sx={{ mb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderRadius: 1, p: 2 }}>
        <Typography variant="body1">
          Toggle Option {index + 1}:
        </Typography>
        <FormControlLabel
          control={
            <Switch
              name={key}
              checked={toggleStates[key]}
              onChange={handleToggleChange}
              color="primary"
            />
          }
          label={toggleStates[key] ? 'On' : 'Off'}
          labelPlacement="end"
          sx={{ ml: 2 }}
        />
      </Box>
    ))}
  </Box>
</Box>

    </Container>
  );
};

export default CreateShortPage;
