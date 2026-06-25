// src/data/questionBanks.js

export const HISTORY_BANK = [
    { q: "Which European country first colonized Canada?", a: "France" },
    { q: "What do we call the original inhabitants of Canada?", a: "First Nations" },
    { q: "What were the two main languages spoken by early settlers?", a: "English and French" },
    { q: "What natural resource drove the early Canadian economy?", a: "Fur" },
    { q: "What is the name of the agreement between First Nations and the Crown?", a: "Treaty" },
    { q: "Which level of government is responsible for garbage collection?", a: "Municipal" },
    { q: "Which level of government is responsible for the military?", a: "Federal" },
    { q: "Which level of government is responsible for schools?", a: "Provincial" },
    { q: "Who is the head of the municipal government?", a: "Mayor" },
    { q: "Who is the head of the provincial government?", a: "Premier" },
    { q: "Who is the head of the federal government?", a: "Prime Minister" },
    { q: "What city is the capital of Canada?", a: "Ottawa" },
    { q: "What city is the capital of Ontario?", a: "Toronto" },
    { q: "What ocean borders Canada to the west?", a: "Pacific Ocean" },
    { q: "What ocean borders Canada to the east?", a: "Atlantic Ocean" },
    { q: "What ocean borders Canada to the north?", a: "Arctic Ocean" },
    { q: "What leaf is on the Canadian flag?", a: "Maple leaf" },
    { q: "How many provinces are in Canada?", a: "10" },
    { q: "How many territories are in Canada?", a: "3" },
    { q: "What is the largest province in Canada by land area?", a: "Quebec" },
    { q: "What is the name of the Indigenous housing structure made of poles and bark?", a: "Wigwam" },
    { q: "What animal pelt was most valuable in the fur trade?", a: "Beaver" },
    { q: "What document outlines the rules for how Canada is governed?", a: "Constitution" },
    { q: "What age do you have to be to vote in a Canadian election?", a: "18" },
    { q: "Who was the first Prime Minister of Canada?", a: "John A Macdonald" }
];

export const MATH_BLITZ_BANK = [
    { q: "What is 5 x 5?", a: "25" },
    { q: "What is 120 / 10?", a: "12" },
    { q: "What is 9 + 10?", a: "19" },
    { q: "Solve: 3 x 3 - 2", a: "7" },
    { q: "What is 7 x 8?", a: "56" },
    { q: "What is 100 - 45?", a: "55" },
    { q: "Solve: 4 x 12", a: "48" },
    { q: "What is 50 / 2?", a: "25" }
    // You can add your 50+ Grade 5 math questions right below this line!
];

export const SCIENCE_BLITZ_BANK = [
    { q: "Which organ pumps blood throughout the human body?", options: ["Lungs", "Brain", "Heart"], a: "Heart" },
    { q: "What state of matter is water vapor?", options: ["Solid", "Liquid", "Gas"], a: "Gas" },
    { q: "What force pulls objects toward the center of the Earth?", options: ["Friction", "Magnetism", "Gravity"], a: "Gravity" },
    { q: "Which of these is a renewable source of energy?", options: ["Coal", "Solar", "Natural Gas"], a: "Solar" },
    { q: "What body system includes the stomach and intestines?", options: ["Digestive", "Respiratory", "Nervous"], a: "Digestive" },
    { q: "When ice melts into liquid water what type of change is it?", options: ["Chemical", "Physical", "Biological"], a: "Physical" },
    { q: "What is the push or pull on an object called?", options: ["Mass", "Force", "Volume"], a: "Force" },
    { q: "Which part of the body takes in oxygen?", options: ["Heart", "Lungs", "Kidneys"], a: "Lungs" },
    { q: "What do we call a structure that spans across a gap or river?", options: ["Tower", "Bridge", "Skyscraper"], a: "Bridge" },
    { q: "What happens to water when it freezes?", options: ["It expands", "It shrinks", "It turns to gas"], a: "It expands" }
];

export const GAUNTLET_BANK = [
    // 7-second sudden death questions (Keep them snappy!)
    { q: "12 + 15", a: "27" },
    { q: "8 x 7", a: "56" },
    { q: "125 / 5", a: "25" },
    { q: "9 x 9", a: "81" },
    { q: "100 - 33", a: "67" },
    { q: "6 x 8", a: "48" },
    { q: "14 + 26", a: "40" },
    { q: "40 / 8", a: "5" }
];

export const INCANTATION_BANK = [
    { q: "To be, or not to be, that is the question.", a: "To be, or not to be, that is the question." },
    { q: "The quick brown fox jumps over the lazy dog.", a: "The quick brown fox jumps over the lazy dog." },
    { q: "A wizard is never late, nor is he early.", a: "A wizard is never late, nor is he early." },
    { q: "Knowledge is the ultimate weapon of the realm.", a: "Knowledge is the ultimate weapon of the realm." }
];

export const MULTISTEP_BANK = [
    {
        title: 'Division Hydra',
        steps: [
            { q: "Step 1: How many 4s in 4?", a: "1" },
            { q: "Step 2: How many 4s in 8?", a: "2" },
            { q: "Final: What is 48 / 4?", a: "12" }
        ]
    },
    {
        title: 'Multiplication Hydra',
        steps: [
            { q: "Step 1: What is 15 x 2?", a: "30" },
            { q: "Step 2: What is 15 x 10?", a: "150" },
            { q: "Final: Add them. What is 15 x 12?", a: "180" }
        ]
    },
    {
        title: 'Commerce Hydra',
        steps: [
            { q: "Step 1: Bought $6 potion + $7 shield. Total cost?", a: "13" },
            { q: "Step 2: Paid with $20. What is 20 - 13?", a: "7" },
            { q: "Final: Total Change?", a: "7" }
        ]
    },
    {
        title: 'Geometry Hydra',
        steps: [
            { q: "Step 1: Box A is 5x4. Area?", a: "20" },
            { q: "Step 2: Box B is 3x2. Area?", a: "6" },
            { q: "Final: Total Area?", a: "26" }
        ]
    }
];