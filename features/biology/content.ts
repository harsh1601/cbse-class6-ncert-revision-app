export type SubjectId = "science" | "maths" | "sst";

export type ExamGoal = "daily-revision" | "school-exam" | "quick-practice";

export type ChapterId = `${SubjectId}-${number}`;

export type SourceRef = {
  id: string;
  label: string;
  url: string;
  locator: string;
};

export type ChapterTerm = {
  term: string;
  meaning: string;
  example: string;
};

export type Chapter = {
  id: ChapterId;
  subjectId: SubjectId;
  number: number;
  title: string;
  bookTitle: string;
  theme: string;
  summary: string;
  focus: string[];
  terms: ChapterTerm[];
  pdfUrl: string;
  videoSearchUrl: string;
  sourceRefIds: string[];
};

export type Subject = {
  id: SubjectId;
  title: string;
  shortTitle: string;
  bookTitle: string;
  description: string;
  accent: string;
  softAccent: string;
  ncertUrl: string;
  chapters: Chapter[];
};

export type McqQuestion = {
  id: string;
  prompt: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
};

export type MatchQuestion = {
  id: string;
  left: string;
  right: string;
};

export type TrueFalseQuestion = {
  id: string;
  statement: string;
  correctAnswer: boolean;
  explanation: string;
};

export type FillBlankQuestion = {
  id: string;
  prompt: string;
  correctAnswer: string;
  explanation: string;
};

export type WrittenQuestion = {
  id: string;
  prompt: string;
  keyPoints: string[];
  modelAnswer: string;
};

export type QuestionPaper = {
  id: string;
  chapterId: ChapterId;
  setNumber: number;
  title: string;
  mcqs: McqQuestion[];
  matches: MatchQuestion[];
  trueFalse: TrueFalseQuestion[];
  blanks: FillBlankQuestion[];
  shortAnswers: WrittenQuestion[];
  longAnswers: WrittenQuestion[];
  practicalQuestions?: WrittenQuestion[];
};

const ncertBase = "https://ncert.nic.in/textbook/pdf";

function chapter(
  subjectId: SubjectId,
  bookCode: string,
  bookTitle: string,
  theme: string,
  number: number,
  title: string,
  summary: string,
  focus: string[],
  terms: ChapterTerm[],
): Chapter {
  const id = `${subjectId}-${number}` as ChapterId;
  const query = encodeURIComponent(`CBSE Class 6 NCERT ${bookTitle} Chapter ${number} ${title} revision`);

  return {
    id,
    subjectId,
    number,
    title,
    bookTitle,
    theme,
    summary,
    focus,
    terms,
    pdfUrl: `${ncertBase}/${bookCode}${String(number).padStart(2, "0")}.pdf`,
    videoSearchUrl: `https://www.youtube.com/results?search_query=${query}`,
    sourceRefIds: [`ncert-${subjectId}`, `ncert-${id}`],
  };
}

function t(term: string, meaning: string, example: string): ChapterTerm {
  return { term, meaning, example };
}

const scienceBook = "Curiosity";
const mathsBook = "Ganita Prakash";
const sstBook = "Exploring Society: India and Beyond";

const scienceChapters = [
  chapter("science", "fecu1", scienceBook, "Science", 1, "The Wonderful World of Science", "Science begins with curiosity, careful observation, questions, evidence, and trying things out. This opening chapter connects everyday experiences with scientific habits of mind.", ["Observe carefully before concluding.", "Ask testable questions.", "Use evidence from activities."], [
    t("Observation", "looking carefully and noticing details", "watching how a shadow changes during the day"),
    t("Question", "something we ask to find out more", "asking why some objects float"),
    t("Experiment", "a planned activity to test an idea", "testing which material absorbs water"),
    t("Evidence", "facts or observations that support an answer", "measurements written in a notebook"),
    t("Curiosity", "the wish to explore and learn", "wondering how a seed becomes a plant"),
    t("Scientific method", "a way of asking, testing, observing, and improving ideas", "changing one factor and comparing results"),
  ]),
  chapter("science", "fecu1", scienceBook, "Life and Health", 2, "Diversity in the Living World", "Living things show variety in size, form, habitat, and features. The chapter builds the idea that organisms can be grouped by observable characteristics.", ["Identify variety among plants and animals.", "Connect organisms with habitats.", "Use visible features for grouping."], [
    t("Diversity", "variety among living things", "different plants in a school garden"),
    t("Habitat", "the place where an organism lives", "a pond for lotus and fish"),
    t("Adaptation", "a feature that helps a living thing survive", "a cactus having spines"),
    t("Herb", "a small plant with a soft stem", "coriander"),
    t("Shrub", "a medium-sized bushy plant", "rose"),
    t("Tree", "a tall plant with a hard woody stem", "mango tree"),
  ]),
  chapter("science", "fecu1", scienceBook, "Life and Health", 3, "Mindful Eating: A Path to a Healthy Body", "Food choices affect growth, energy, and health. The chapter focuses on nutrients, balanced diet, food diversity, hygiene, and mindful eating habits.", ["Choose food from different food groups.", "Understand nutrients and deficiency.", "Connect clean food habits with health."], [
    t("Balanced diet", "food that gives all needed nutrients in proper amounts", "dal, rice, vegetables, curd, and fruit"),
    t("Nutrients", "useful substances present in food", "proteins and vitamins"),
    t("Millets", "nutritious grains grown in many parts of India", "ragi and bajra"),
    t("Deficiency", "lack of a nutrient needed by the body", "lack of iron causing weakness"),
    t("Food groups", "ways of grouping foods by nutrients", "energy-giving and body-building foods"),
    t("Hygiene", "clean habits that prevent disease", "washing hands before eating"),
  ]),
  chapter("science", "fecu1", scienceBook, "Forces and Materials", 4, "Exploring Magnets", "Magnets attract some materials and have poles that behave in predictable ways. The chapter uses activities to explore attraction, repulsion, and compass use.", ["Test magnetic and non-magnetic materials.", "Identify poles of a magnet.", "Use a compass for direction."], [
    t("Magnet", "an object that attracts magnetic materials", "bar magnet"),
    t("Poles", "ends of a magnet where its pull is strongest", "north pole and south pole"),
    t("Attraction", "pull between unlike poles or magnetic objects", "magnet pulling an iron nail"),
    t("Repulsion", "push between like poles", "north pole pushing another north pole"),
    t("Compass", "a device with a magnetized needle", "finding north during a walk"),
    t("Magnetic materials", "materials attracted by magnets", "iron and steel"),
  ]),
  chapter("science", "fecu1", scienceBook, "Measurement", 5, "Measurement of Length and Motion", "Measurement helps us compare lengths and describe motion correctly. The chapter introduces standard units, careful measuring, rest, motion, and curved paths.", ["Use standard units for length.", "Avoid gaps and wrong starting points while measuring.", "Describe motion by change in position."], [
    t("Length", "distance from one end to another", "length of a notebook"),
    t("Standard unit", "a unit accepted for common measurement", "metre"),
    t("Motion", "change in position with time", "a moving bicycle"),
    t("Rest", "no change in position with respect to surroundings", "a bag kept on a table"),
    t("Measurement", "finding the size or amount of something", "measuring a desk with a ruler"),
    t("Curved path", "a path that is not straight", "track of a winding road"),
  ]),
  chapter("science", "fecu1", scienceBook, "Forces and Materials", 6, "Materials Around Us", "Objects are made of different materials, and materials have different properties. The chapter teaches grouping by properties such as hardness, transparency, texture, and solubility.", ["Observe material properties.", "Group objects using similarities.", "Choose materials according to use."], [
    t("Material", "substance from which an object is made", "wood used for a chair"),
    t("Properties", "qualities used to describe materials", "hard, soft, shiny, rough"),
    t("Transparency", "ability to let light pass through", "clear glass"),
    t("Solubility", "ability to dissolve in water", "salt dissolving in water"),
    t("Hardness", "resistance to being scratched or pressed", "metal spoon"),
    t("Grouping", "putting things together by common features", "grouping transparent objects"),
  ]),
  chapter("science", "fecu1", scienceBook, "Measurement", 7, "Temperature and its Measurement", "Temperature tells us how hot or cold something is. The chapter explains thermometers, the Celsius scale, safe handling, and why touch alone is unreliable.", ["Read temperature on a scale.", "Use thermometers with care.", "Distinguish hot, cold, and measured temperature."], [
    t("Temperature", "measure of hotness or coldness", "body temperature"),
    t("Thermometer", "instrument used to measure temperature", "laboratory thermometer"),
    t("Celsius scale", "common scale for temperature", "water freezing near 0 degree Celsius"),
    t("Clinical thermometer", "thermometer used for body temperature", "checking fever"),
    t("Heat", "energy that can make things warmer", "sunlight warming water"),
    t("Precaution", "care taken to avoid error or harm", "not holding a thermometer by its bulb"),
  ]),
  chapter("science", "fecu1", scienceBook, "Water", 8, "A Journey through States of Water", "Water changes state when it gains or loses heat. The chapter connects melting, freezing, evaporation, condensation, and the water cycle to daily life.", ["Relate heat to change of state.", "Identify water in solid, liquid, and gas states.", "Explain evaporation and condensation."], [
    t("Evaporation", "change of liquid water into vapour", "wet clothes drying"),
    t("Condensation", "change of water vapour into liquid", "drops on a cold glass"),
    t("Freezing", "change of water into ice", "ice tray in a freezer"),
    t("Melting", "change of ice into water", "ice cube in sunlight"),
    t("Water cycle", "continuous movement of water in nature", "clouds forming and rain falling"),
    t("States of water", "solid, liquid, and gas forms of water", "ice, water, and water vapour"),
  ]),
  chapter("science", "fecu1", scienceBook, "Materials", 9, "Methods of Separation in Everyday Life", "Mixtures can be separated using methods based on differences in size, weight, solubility, and state. The chapter connects separation methods to cooking and daily tasks.", ["Choose a suitable separation method.", "Use properties to separate mixtures.", "Relate separation to everyday life."], [
    t("Separation", "removing one component from a mixture", "taking stones out of rice"),
    t("Handpicking", "separating by picking with hands", "removing pebbles from pulses"),
    t("Sieving", "separating by particle size", "separating flour from bran"),
    t("Sedimentation", "settling of heavier particles", "mud settling in water"),
    t("Filtration", "separating insoluble solid using a filter", "tea leaves from tea"),
    t("Evaporation", "removing liquid by changing it to vapour", "getting salt from salty water"),
  ]),
  chapter("science", "fecu1", scienceBook, "Life", 10, "Living Creatures: Exploring their Characteristics", "Living creatures share characteristics such as growth, movement, respiration, response, reproduction, and excretion. The chapter helps students identify life processes.", ["List characteristics of living things.", "Compare living and non-living things.", "Use examples from plants and animals."], [
    t("Living things", "things that show life processes", "plants and animals"),
    t("Growth", "increase in size or development", "a seedling becoming a plant"),
    t("Respiration", "process of using food to release energy", "breathing supports respiration"),
    t("Reproduction", "production of young ones", "plants producing seeds"),
    t("Stimulus", "a change that causes a response", "touch-me-not leaves closing"),
    t("Excretion", "removal of wastes from the body", "sweating"),
  ]),
  chapter("science", "fecu1", scienceBook, "Environment", 11, "Nature's Treasures", "Nature provides resources such as air, water, soil, forests, minerals, and sunlight. The chapter encourages wise use, conservation, and respect for natural wealth.", ["Identify natural resources.", "Distinguish renewable and non-renewable resources.", "Explain conservation."], [
    t("Natural resources", "useful things obtained from nature", "water and soil"),
    t("Renewable resource", "resource that can be replenished naturally", "sunlight"),
    t("Non-renewable resource", "resource that takes very long to form", "coal"),
    t("Conservation", "careful protection and wise use", "saving water"),
    t("Forest", "large area with many trees and living things", "home for wildlife"),
    t("Water", "essential resource for life", "drinking and farming"),
  ]),
  chapter("science", "fecu1", scienceBook, "Earth and Space", 12, "Beyond Earth", "The sky contains the Sun, Moon, planets, stars, and patterns such as constellations. The chapter builds early ideas about the solar system and observing the night sky.", ["Identify objects seen in the sky.", "Describe the solar system simply.", "Connect rotation with day and night."], [
    t("Solar system", "the Sun and objects that move around it", "planets orbiting the Sun"),
    t("Planet", "large body that moves around a star", "Earth"),
    t("Satellite", "object that moves around a planet", "Moon"),
    t("Stars", "hot glowing bodies that give light", "the Sun"),
    t("Constellation", "pattern of stars seen from Earth", "Saptarishi"),
    t("Rotation", "spinning of a body around its axis", "Earth causing day and night"),
  ]),
];

const mathsChapters = [
  chapter("maths", "fegp1", mathsBook, "Mathematics", 1, "Patterns in Mathematics", "Mathematics often begins by spotting patterns in numbers, shapes, and arrangements. The chapter encourages students to search for rules and explain them.", ["Look for repeated structure.", "Describe a rule clearly.", "Represent patterns using numbers and shapes."], [
    t("Pattern", "an arrangement that follows a rule", "2, 4, 6, 8"),
    t("Sequence", "ordered list of numbers or shapes", "1, 3, 5, 7"),
    t("Square number", "number made by a square array", "16 as 4 by 4"),
    t("Triangular number", "number made by a triangular array", "10 dots in a triangle"),
    t("Rule", "statement that explains a pattern", "add 3 each time"),
    t("Repeating pattern", "pattern that repeats a unit", "red, blue, red, blue"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Geometry", 2, "Lines and Angles", "This chapter introduces points, lines, rays, line segments, and angles. Students learn to compare, classify, and measure angles.", ["Use correct geometry names.", "Measure angles with a protractor.", "Classify acute, right, obtuse, and straight angles."], [
    t("Point", "exact location with no size", "point A on paper"),
    t("Line segment", "part of a line with two endpoints", "side of a notebook"),
    t("Ray", "part of a line with one endpoint", "sun ray shown in a drawing"),
    t("Angle", "figure formed by two rays meeting", "corner of a book"),
    t("Right angle", "angle measuring 90 degrees", "corner of a square"),
    t("Protractor", "instrument used to measure angles", "measuring 60 degrees"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Numbers", 3, "Number Play", "Number Play uses puzzles and games to strengthen place value, operations, estimation, and number relationships. It asks students to reason, not just calculate.", ["Use place value flexibly.", "Try mental strategies.", "Explain number patterns."], [
    t("Number pattern", "relationship in a group of numbers", "5, 10, 20, 40"),
    t("Place value", "value of a digit based on its position", "7 in 7,000"),
    t("Palindrome", "number that reads the same both ways", "1221"),
    t("Kaprekar idea", "number puzzle using rearranged digits", "6174 routine"),
    t("Estimation", "reasonable approximate value", "about 500"),
    t("Operation", "mathematical process", "addition or subtraction"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Data", 4, "Data Handling and Presentation", "Data becomes useful when it is collected, organized, and displayed clearly. The chapter introduces tally marks, pictographs, bar graphs, and scales.", ["Collect data carefully.", "Read pictographs and bar graphs.", "Choose a suitable scale."], [
    t("Data", "collected information", "shoe sizes of students"),
    t("Tally marks", "quick marks used for counting", "groups of five strokes"),
    t("Pictograph", "data shown using pictures", "one book symbol for 10 books"),
    t("Bar graph", "data shown using bars", "bars for monthly rainfall"),
    t("Scale", "value represented by one unit or symbol", "1 symbol = 5 students"),
    t("Frequency", "number of times something occurs", "students with shoe size 5"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Numbers", 5, "Prime Time", "Prime Time explores factors, multiples, prime numbers, composite numbers, and divisibility. These ideas help students understand the structure of whole numbers.", ["Find factors and multiples.", "Separate prime and composite numbers.", "Use divisibility ideas."], [
    t("Prime number", "number with exactly two factors", "13"),
    t("Composite number", "number with more than two factors", "12"),
    t("Factor", "number that divides another exactly", "3 is a factor of 12"),
    t("Multiple", "product of a number and a whole number", "24 is a multiple of 6"),
    t("Divisibility", "checking if division leaves no remainder", "even numbers divisible by 2"),
    t("Common factor", "factor shared by two or more numbers", "4 for 8 and 12"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Measurement", 6, "Perimeter and Area", "Perimeter measures boundary length, while area measures covered surface. The chapter revises these concepts through squares, rectangles, and practical puzzles.", ["Distinguish perimeter and area.", "Use units correctly.", "Apply rectangle and square formulas."], [
    t("Perimeter", "distance around a closed shape", "fence around a garden"),
    t("Area", "surface covered by a shape", "tiles covering a floor"),
    t("Rectangle", "four-sided shape with opposite sides equal", "classroom board"),
    t("Square", "four-sided shape with all sides equal", "chessboard square"),
    t("Unit square", "square of side one unit", "1 cm by 1 cm square"),
    t("Formula", "rule written using numbers or letters", "area of rectangle = length x breadth"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Numbers", 7, "Fractions", "Fractions describe parts of a whole or collection. Students compare, represent, add, and subtract fractions using visual and number ideas.", ["Connect fraction symbols with parts.", "Compare fractions using reasoning.", "Add and subtract related fractions."], [
    t("Fraction", "number showing part of a whole", "3/4 of a roti"),
    t("Numerator", "top number of a fraction", "3 in 3/5"),
    t("Denominator", "bottom number showing equal parts", "5 in 3/5"),
    t("Equivalent fraction", "fraction with the same value", "1/2 and 2/4"),
    t("Comparison", "deciding which fraction is greater", "3/4 greater than 1/4"),
    t("Addition", "combining fractions", "1/5 + 2/5 = 3/5"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Geometry", 8, "Playing with Constructions", "Construction uses tools like compass and ruler to draw accurate shapes. The chapter builds geometric intuition through hands-on drawing.", ["Use compass and ruler safely.", "Draw circles and arcs.", "Follow construction steps."], [
    t("Compass", "tool used to draw circles and arcs", "drawing a circle"),
    t("Ruler", "tool used to draw straight lines and measure", "drawing a 6 cm line"),
    t("Circle", "set of points at equal distance from centre", "bangle outline"),
    t("Radius", "distance from centre to circle", "spoke of a wheel"),
    t("Construction", "accurate drawing using tools", "copying a line segment"),
    t("Arc", "part of a circle", "curved compass mark"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Geometry", 9, "Symmetry", "Symmetry appears in art, nature, and geometry. The chapter explores line symmetry, reflection, rotational symmetry, and symmetric patterns.", ["Identify lines of symmetry.", "Use folding or reflection to test.", "Notice symmetry in designs."], [
    t("Symmetry", "balanced matching of parts", "butterfly wings"),
    t("Line of symmetry", "line that divides a figure into matching halves", "fold line of a paper heart"),
    t("Reflection", "mirror image of a figure", "face in a mirror"),
    t("Rotational symmetry", "matching after turning", "rangoli pattern"),
    t("Pattern", "repeated design or arrangement", "tile design"),
    t("Fold", "way to test line symmetry", "folding paper into halves"),
  ]),
  chapter("maths", "fegp1", mathsBook, "Numbers", 10, "The Other Side of Zero", "Negative numbers extend the number line to the other side of zero. The chapter connects integers with temperature, floors, height, and gains or losses.", ["Place negative numbers on a number line.", "Compare integers.", "Use real-life contexts for negative numbers."], [
    t("Negative number", "number less than zero", "-5"),
    t("Zero", "point separating positive and negative numbers", "0 on a number line"),
    t("Integer", "whole number including negatives and zero", "-3, 0, 4"),
    t("Number line", "line showing numbers in order", "marks from -5 to 5"),
    t("Opposite", "number at equal distance on other side of zero", "-6 and 6"),
    t("Temperature", "context where negatives are used", "-2 degree Celsius"),
  ]),
];

const sstChapters = [
  chapter("sst", "fees1", sstBook, "India and the World", 1, "Locating Places on the Earth", "Maps help us represent places and find locations using scale, direction, symbols, latitude, and longitude. The chapter develops basic map-reading skills.", ["Read maps using components.", "Use cardinal and intermediate directions.", "Understand coordinates."], [
    t("Map", "drawing of an area from above", "map of a city"),
    t("Scale", "relationship between map distance and real distance", "1 cm = 500 m"),
    t("Direction", "way to locate places using north, south, east, and west", "market north of school"),
    t("Symbol", "small sign used on a map", "railway station symbol"),
    t("Latitude", "imaginary east-west circle used for location", "Equator at 0 degrees"),
    t("Longitude", "imaginary north-south line used for location", "Prime Meridian"),
  ]),
  chapter("sst", "fees1", sstBook, "India and the World", 2, "Oceans and Continents", "Earth has vast oceans and large landmasses called continents. The chapter explains their names, distribution, and importance for life.", ["Name major oceans and continents.", "Recognize Earth as the blue planet.", "Explain how oceans affect life."], [
    t("Ocean", "very large body of salty water", "Pacific Ocean"),
    t("Continent", "large continuous landmass", "Asia"),
    t("Island", "land surrounded by water", "Andaman island"),
    t("Blue planet", "name for Earth because much of it is water", "Earth seen from space"),
    t("Marine life", "living things in seas and oceans", "fish and coral"),
    t("Coast", "land along the sea", "Konkan coast"),
  ]),
  chapter("sst", "fees1", sstBook, "India and the World", 3, "Landforms and Life", "Mountains, plateaus, and plains shape climate, rivers, occupations, transport, and culture. The chapter connects landforms with human life.", ["Identify major landforms.", "Link landforms with opportunities and challenges.", "Understand rivers and valleys."], [
    t("Mountain", "high landform with steep slopes", "Himalayas"),
    t("Plateau", "high flat land", "Deccan Plateau"),
    t("Plain", "broad flat lowland", "Gangetic plain"),
    t("Landform", "natural feature of Earth's surface", "hill or valley"),
    t("Valley", "low area between hills or mountains", "river valley"),
    t("River basin", "area drained by a river and its tributaries", "Ganga basin"),
  ]),
  chapter("sst", "fees1", sstBook, "Tapestry of the Past", 4, "Timeline and Sources of History", "History is studied through timelines and sources such as objects, texts, inscriptions, and oral traditions. The chapter introduces evidence about the past.", ["Read simple timelines.", "Distinguish different sources.", "Use BCE and CE carefully."], [
    t("Timeline", "line showing events in order", "events from 3000 BCE to 2000 CE"),
    t("Source", "evidence used to learn about the past", "coin or inscription"),
    t("Archaeology", "study of old objects and sites", "excavating a settlement"),
    t("BCE/CE", "terms used to count years in history", "500 BCE"),
    t("Manuscript", "old handwritten text", "palm-leaf manuscript"),
    t("Oral tradition", "knowledge passed by speaking", "folk stories"),
  ]),
  chapter("sst", "fees1", sstBook, "Tapestry of the Past", 5, "India, That Is Bharat", "India has had many names over time, including Bharat and Jambudvipa. The chapter uses texts, inscriptions, and travellers' accounts to explore India's identity.", ["Know ancient names of India.", "Connect Sindhu with names like India.", "Understand the phrase India, that is Bharat."], [
    t("Bharat", "ancient and modern name for India", "India, that is Bharat"),
    t("India", "name linked with the Indus/Sindhu region", "English name of the country"),
    t("Jambudvipa", "old name used for the Indian Subcontinent", "ancient texts"),
    t("Sindhu", "name connected with the Indus River", "source of Hind and India"),
    t("Constitution", "basic law document of a country", "Constitution of India"),
    t("Subcontinent", "large distinct part of a continent", "Indian Subcontinent"),
  ]),
  chapter("sst", "fees1", sstBook, "Tapestry of the Past", 6, "The Beginnings of Indian Civilisation", "The Harappan or Indus-Sarasvati civilisation had planned cities, drainage, crafts, trade, and agriculture. The chapter introduces early urban life in India.", ["Describe features of civilisation.", "Identify Harappan achievements.", "Use archaeological evidence."], [
    t("Civilisation", "advanced stage of organized society", "Harappan civilisation"),
    t("Harappan", "related to the Indus-Sarasvati civilisation", "Harappa and Mohenjo-daro"),
    t("Urban planning", "planned layout of towns and cities", "straight streets"),
    t("Trade", "exchange of goods", "beads and metals"),
    t("Drainage", "system for removing wastewater", "covered drains"),
    t("Script", "system of written signs", "Harappan signs"),
  ]),
  chapter("sst", "fees1", sstBook, "Cultural Heritage", 7, "India's Cultural Roots", "India's cultural roots include knowledge traditions, Vedas, schools of thought, Buddhism, Jainism, and folk and tribal traditions. The chapter shows continuity and variety.", ["Recognize knowledge traditions.", "Know early schools of thought.", "Respect folk and tribal contributions."], [
    t("Vedas", "ancient Indian texts of knowledge", "Rig Veda"),
    t("Knowledge tradition", "ways knowledge is preserved and shared", "teacher-student learning"),
    t("Buddhism", "school of thought linked with the Buddha", "middle path"),
    t("Jainism", "school of thought linked with Mahavira", "ahimsa"),
    t("Folk tradition", "community tradition of songs, stories, or practices", "folk song"),
    t("Tribal tradition", "knowledge and practices of tribal communities", "forest knowledge"),
  ]),
  chapter("sst", "fees1", sstBook, "Cultural Heritage", 8, "Unity in Diversity, or 'Many in the One'", "India has great diversity in language, dress, food, festivals, and customs, yet many shared ideas and practices create unity. The chapter explores this balance.", ["Identify forms of diversity.", "Find shared cultural threads.", "Value unity without sameness."], [
    t("Diversity", "presence of many different forms", "many languages"),
    t("Unity", "sense of togetherness", "national festivals"),
    t("Language", "system of communication", "Hindi, Tamil, Bengali"),
    t("Festival", "special celebration", "Diwali or Eid"),
    t("Migration", "movement of people from one place to another", "workers moving to a city"),
    t("Shared culture", "common practices across groups", "respect for guests"),
  ]),
  chapter("sst", "fees1", sstBook, "Governance and Democracy", 9, "Family and Community", "Families and communities support people through care, cooperation, roles, responsibilities, and shared resources. The chapter links personal life with social life.", ["Compare family types.", "Explain cooperation and responsibility.", "Understand community support."], [
    t("Family", "basic unit of society", "parents and children"),
    t("Community", "group of connected people", "neighbourhood"),
    t("Joint family", "family with several generations living together", "grandparents, parents, uncles, children"),
    t("Nuclear family", "family with parents and children", "couple and their children"),
    t("Cooperation", "working together", "sharing household work"),
    t("Responsibility", "duty towards others", "helping younger sibling"),
  ]),
  chapter("sst", "fees1", sstBook, "Governance and Democracy", 10, "Grassroots Democracy - Part 1: Governance", "Governance uses rules, institutions, participation, and justice to manage society. The chapter introduces why governments are needed and what democracy means.", ["Explain why rules are needed.", "Connect government with public needs.", "Understand democracy as participation."], [
    t("Governance", "process of making and applying rules for society", "running a school or city"),
    t("Government", "institution that makes decisions for people", "local or state government"),
    t("Rules", "guidelines for order and fairness", "traffic rules"),
    t("Democracy", "system where people participate in governance", "voting and discussion"),
    t("Justice", "fair treatment", "same rule for everyone"),
    t("Participation", "taking part in decisions or actions", "joining a class discussion"),
  ]),
  chapter("sst", "fees1", sstBook, "Governance and Democracy", 11, "Grassroots Democracy - Part 2: Local Government in Rural Areas", "Rural local government works through Panchayati Raj institutions. The chapter explains Gram Sabha, Panchayat, Sarpanch, and local problem-solving.", ["Understand Panchayati Raj.", "Know rural local bodies.", "Explain local decision-making."], [
    t("Panchayat", "village-level local government body", "Gram Panchayat"),
    t("Gram Sabha", "assembly of adult village members", "village meeting"),
    t("Sarpanch", "elected head of a Gram Panchayat", "chairing a meeting"),
    t("Panchayati Raj", "system of rural local self-government", "three-tier local system"),
    t("Local issue", "problem affecting a local area", "repairing a village road"),
    t("Ward", "smaller area represented by a member", "village ward"),
  ]),
  chapter("sst", "fees1", sstBook, "Governance and Democracy", 12, "Grassroots Democracy - Part 3: Local Government in Urban Areas", "Urban local bodies manage services such as roads, water, sanitation, streetlights, and public spaces. The chapter explains municipalities and municipal corporations.", ["Identify urban local bodies.", "List services they provide.", "Recognize citizen participation."], [
    t("Municipality", "urban local body for a town or smaller city", "town municipality"),
    t("Municipal corporation", "urban local body for a large city", "Mumbai corporation"),
    t("Councillor", "elected representative of a ward", "ward councillor"),
    t("Urban services", "services needed in towns and cities", "water supply and garbage collection"),
    t("Tax", "money collected by government for public work", "property tax"),
    t("Participatory democracy", "people taking part in governance", "citizens reporting civic problems"),
  ]),
  chapter("sst", "fees1", sstBook, "Economic Life", 13, "The Value of Work", "Work can be economic or non-economic. The chapter shows that paid work, unpaid care, community service, and value addition all matter in society.", ["Distinguish economic and non-economic activities.", "Explain value addition.", "Respect different forms of work."], [
    t("Economic activity", "activity involving money or money's worth", "selling vegetables"),
    t("Non-economic activity", "activity done from care, duty, or service without income", "cooking for family"),
    t("Salary", "fixed regular payment", "monthly teacher salary"),
    t("Wage", "payment for work over a period", "daily wage for labour"),
    t("Payment in kind", "non-cash payment for work", "receiving grains for work"),
    t("Value addition", "increase in value through skill or work", "wood made into a chair"),
  ]),
  chapter("sst", "fees1", sstBook, "Economic Life", 14, "Economic Activities Around Us", "Economic activities are grouped into primary, secondary, and tertiary sectors. The chapter explains how sectors differ and how they are connected.", ["Classify activities into sectors.", "Use examples from daily life.", "Explain links among sectors."], [
    t("Primary sector", "activities directly using nature", "farming and fishing"),
    t("Secondary sector", "activities that transform raw materials", "manufacturing cloth"),
    t("Tertiary sector", "activities that provide services", "banking and transport"),
    t("Agriculture", "cultivation of crops", "growing wheat"),
    t("Manufacturing", "making goods from materials", "making furniture"),
    t("Services", "work that helps people or businesses", "healthcare"),
  ]),
];

export const class6Subjects: Subject[] = [
  {
    id: "science",
    title: "Science",
    shortTitle: "Science",
    bookTitle: scienceBook,
    description: "Curiosity-led revision with activities, key terms, and science practice papers.",
    accent: "#0ea5e9",
    softAccent: "#e0f2fe",
    ncertUrl: "https://ncert.nic.in/textbook.php?fecu1=0-12",
    chapters: scienceChapters,
  },
  {
    id: "maths",
    title: "Mathematics",
    shortTitle: "Maths",
    bookTitle: mathsBook,
    description: "Concept-first revision for numbers, geometry, data, fractions, and integers.",
    accent: "#16a34a",
    softAccent: "#dcfce7",
    ncertUrl: "https://ncert.nic.in/textbook.php?fegp1=0-10",
    chapters: mathsChapters,
  },
  {
    id: "sst",
    title: "Social Science",
    shortTitle: "SST",
    bookTitle: sstBook,
    description: "Integrated geography, history, civics, culture, and economics revision.",
    accent: "#ef4444",
    softAccent: "#fee2e2",
    ncertUrl: "https://ncert.nic.in/textbook.php?fees1=0-14",
    chapters: sstChapters,
  },
];

export const allChapters = class6Subjects.flatMap((subject) => subject.chapters);

const baseSourceRefs: Record<string, SourceRef> = {
  "ncert-service": {
    id: "ncert-service",
    label: "NCERT Textbook Service",
    url: "https://ncert.nic.in/textbook.php",
    locator: "Official NCERT textbook PDF service",
  },
  "ncert-science": {
    id: "ncert-science",
    label: "NCERT Science",
    url: "https://ncert.nic.in/textbook.php?fecu1=0-12",
    locator: "Curiosity, Grade 6 Science",
  },
  "ncert-maths": {
    id: "ncert-maths",
    label: "NCERT Maths",
    url: "https://ncert.nic.in/textbook.php?fegp1=0-10",
    locator: "Ganita Prakash, Grade 6 Mathematics",
  },
  "ncert-sst": {
    id: "ncert-sst",
    label: "NCERT SST",
    url: "https://ncert.nic.in/textbook.php?fees1=0-14",
    locator: "Exploring Society: India and Beyond, Grade 6 Social Science",
  },
};

export const sourceRefs: Record<string, SourceRef> = {
  ...baseSourceRefs,
  ...Object.fromEntries(
    allChapters.map((item) => [
      `ncert-${item.id}`,
      {
        id: `ncert-${item.id}`,
        label: `Ch ${item.number} PDF`,
        url: item.pdfUrl,
        locator: `${item.bookTitle}, Chapter ${item.number}: ${item.title}`,
      },
    ]),
  ),
};

export function getSubjectById(subjectId: string): Subject | undefined {
  return class6Subjects.find((subject) => subject.id === subjectId);
}

export function getChapterById(chapterId: string): Chapter | undefined {
  return allChapters.find((item) => item.id === chapterId);
}

export const getTopicById = getChapterById;

export function getSourceRefs(sourceRefIds: string[]) {
  return sourceRefIds.map((id) => sourceRefs[id]).filter(Boolean);
}

function rotate<T>(items: T[], offset: number) {
  return items.map((_, index) => items[(index + offset) % items.length]);
}

function unique(items: string[]) {
  return Array.from(new Set(items));
}

function subjectTermPool(subjectId: SubjectId) {
  return unique(
    allChapters
      .filter((item) => item.subjectId === subjectId)
      .flatMap((item) => item.terms.map((term) => term.term)),
  );
}

function subjectExamplePool(subjectId: SubjectId) {
  return unique(
    allChapters
      .filter((item) => item.subjectId === subjectId)
      .flatMap((item) => item.terms.map((term) => term.example)),
  );
}

function options(correct: string, pool: string[], offset: number) {
  const distractors = rotate(pool.filter((item) => item !== correct), offset).slice(0, 3);
  return rotate(unique([correct, ...distractors]), offset % 4);
}

function termAt(chapter: Chapter, index: number, setNumber: number) {
  return chapter.terms[(index + setNumber - 1) % chapter.terms.length];
}

export function getPaperCountForChapter(chapter: Chapter) {
  return chapter.subjectId === "maths" ? 10 : 5;
}

function mathsPracticalDetails(chapter: Chapter, setNumber: number, index: number, selected: ChapterTerm, focus: string) {
  const seed = chapter.number * 17 + setNumber * 11 + index * 3;
  const variant = index % 5;
  const a = (seed % 9) + 3;
  const b = (seed % 7) + 2;
  const c = (seed % 5) + 4;
  const d = (seed % 4) + 2;

  if (chapter.number === 1) {
    const start = a;
    const step = b;
    const row = c;
    const rowValue = start + (row - 1) * step;
    const squareSide = d + 2;

    if (variant === 0) {
      return {
        prompt: `A rangoli pattern has ${start}, ${start + step}, ${start + step * 2}, ${start + step * 3} dots in the first four rows. Find the next two rows and explain the rule.`,
        keyPoints: [`The rule is add ${step}.`, `The next two rows have ${start + step * 4} and ${start + step * 5} dots.`, focus],
        modelAnswer: `The numbers increase by ${step} each time, so the next two rows are ${start + step * 4} and ${start + step * 5}. This is a ${selected.term.toLowerCase()} because ${selected.meaning}.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `A staircase pattern starts with ${start} tiles and each new step adds ${step} tiles. How many tiles are needed for step ${row}?`,
        keyPoints: [`Use start + repeated addition of ${step}.`, `Step ${row} needs ${rowValue} tiles.`, "Show the repeated addition clearly."],
        modelAnswer: `Step ${row} needs ${start} + ${step} x ${row - 1} = ${rowValue} tiles.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `Draw or describe a square-dot pattern with side ${squareSide}. How many dots are in the square arrangement?`,
        keyPoints: [`Use ${squareSide} x ${squareSide}.`, `There are ${squareSide * squareSide} dots.`, "Explain why it is a square number."],
        modelAnswer: `A square arrangement with side ${squareSide} has ${squareSide} x ${squareSide} = ${squareSide * squareSide} dots, so ${squareSide * squareSide} is a square number.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `A badge design repeats this order: red, blue, green, red, blue, green. What colour will be at position ${seed % 18 + 7}? Explain your method.`,
        keyPoints: ["Use a repeating unit of three colours.", "Divide the position by 3 and use the remainder.", selected.example],
        modelAnswer: `The repeating unit has 3 colours. Check the remainder after dividing the position by 3; remainder 1 is red, 2 is blue, and 0 is green.`,
      };
    }

    return {
      prompt: `Make a number pattern from daily life using ${selected.term}. Write the first six terms and explain the rule.`,
      keyPoints: [`Use ${selected.term}: ${selected.meaning}.`, "Write six terms.", "State the rule in one clear sentence."],
      modelAnswer: `One answer can use ${selected.example}. A complete answer lists six terms and explains the rule, such as adding the same number each time.`,
    };
  }

  if (chapter.number === 2) {
    const angle = [30, 45, 60, 90, 120][variant];

    if (variant === 0) {
      return {
        prompt: `A door opens by ${angle} degrees. Classify the angle and name one object in your room with a similar angle.`,
        keyPoints: [`${angle} degrees is an acute angle.`, "Give one real object example.", "Use correct geometry language."],
        modelAnswer: `${angle} degrees is less than 90 degrees, so it is an acute angle. A partly opened book or door can show a similar angle.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `Measure a corner of your notebook using a protractor. What angle should it show, and why?`,
        keyPoints: ["A notebook corner is usually 90 degrees.", "It is a right angle.", "Mention protractor placement."],
        modelAnswer: `A notebook corner should measure about 90 degrees. It is a right angle because the two sides meet like the corner of a square.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `A pencil is ${a + 7} cm long. Draw a line segment of the same length and write the steps you used.`,
        keyPoints: [`Draw a line segment of ${a + 7} cm.`, "Use a ruler from 0 cm.", "Mark both endpoints."],
        modelAnswer: `Place the ruler at 0 cm, mark ${a + 7} cm, and join the two marks with a straight line segment. The line segment has two endpoints.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `Find two examples each of a ray, a line segment, and an angle from your classroom.`,
        keyPoints: ["Give examples for all three terms.", `Use ${selected.term}: ${selected.meaning}.`, focus],
        modelAnswer: `Examples can include a side of the board as a line segment, a torch beam drawing as a ray, and a book corner as an angle.`,
      };
    }

    return {
      prompt: `A clock shows 3 o'clock. What kind of angle is formed between the hour hand and minute hand? Explain.`,
      keyPoints: ["3 o'clock forms 90 degrees.", "90 degrees is a right angle.", "Use two rays meeting at the centre of the clock."],
      modelAnswer: `At 3 o'clock the hands form a 90 degree angle, so it is a right angle. The two clock hands act like rays meeting at the centre.`,
    };
  }

  if (chapter.number === 4) {
    const total = a + b + c + d;

    if (variant === 0) {
      return {
        prompt: `In a class survey, ${a} students like cricket, ${b} like football, ${c} like badminton, and ${d} like chess. Find the total number of students and suggest a suitable way to present the data.`,
        keyPoints: [`Total students = ${total}.`, "A bar graph or pictograph is suitable.", "Label categories clearly."],
        modelAnswer: `The total is ${a} + ${b} + ${c} + ${d} = ${total}. A bar graph can show the four sports clearly.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `A pictograph uses one book symbol for ${b} books. If the library borrowed ${b * c} books, how many symbols should be drawn?`,
        keyPoints: [`Each symbol = ${b} books.`, `${b * c} divided by ${b} = ${c}.`, "Use the scale correctly."],
        modelAnswer: `${b * c} books need ${b * c} / ${b} = ${c} symbols.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `Make tally marks for ${a + c} students choosing mango juice. How many full groups of five and extra marks will be shown?`,
        keyPoints: [`${a + c} = ${Math.floor((a + c) / 5)} groups of five and ${(a + c) % 5} extra.`, "Use tally groups of five.", selected.example],
        modelAnswer: `${a + c} tally marks make ${Math.floor((a + c) / 5)} full groups of five with ${(a + c) % 5} extra mark(s).`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `A bar graph scale is 1 square = ${d} students. A bar is ${c} squares tall. What frequency does it show?`,
        keyPoints: [`Frequency = ${c} x ${d}.`, `The bar shows ${c * d} students.`, "Mention the scale."],
        modelAnswer: `The frequency is ${c} x ${d} = ${c * d} students.`,
      };
    }

    return {
      prompt: `Write three survey questions you can ask classmates to collect data for ${chapter.title}.`,
      keyPoints: ["Questions should collect countable data.", "Use clear categories.", "Mention how the data will be presented."],
      modelAnswer: `Examples: favourite fruit, transport used to come to school, and preferred game. The answers can be counted and shown in a table or graph.`,
    };
  }

  if (chapter.number === 5) {
    const number = a * b;
    const second = number + b;

    if (variant === 0) {
      return {
        prompt: `A teacher has ${number} pencils. She wants to pack them equally in boxes. Write all possible box sizes using factors of ${number}.`,
        keyPoints: [`List factors of ${number}.`, "Each factor divides exactly.", "No pencil should be left over."],
        modelAnswer: `The possible box sizes are the factors of ${number}. Check numbers that divide ${number} exactly without a remainder.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `The school bell rings every ${b} minutes and the sports whistle rings every ${c} minutes. After how many minutes will both ring together?`,
        keyPoints: [`Find a common multiple of ${b} and ${c}.`, "Use the smallest common multiple for first time together.", selected.example],
        modelAnswer: `List multiples of ${b} and ${c}; the first common multiple is when both ring together.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `Check whether ${second} is divisible by ${b}. Show the division and write the remainder if any.`,
        keyPoints: [`Divide ${second} by ${b}.`, `Remainder is ${second % b}.`, "State divisible or not divisible."],
        modelAnswer: `${second} divided by ${b} leaves remainder ${second % b}, so it ${second % b === 0 ? "is" : "is not"} divisible by ${b}.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `Choose two numbers between ${a + 10} and ${a + 30}. Identify one prime number and one composite number, and justify your answer.`,
        keyPoints: ["Prime has exactly two factors.", "Composite has more than two factors.", "Show at least one factor check."],
        modelAnswer: `A correct answer names one number with exactly two factors and one number with more than two factors, then shows the factor check.`,
      };
    }

    return {
      prompt: `A class has ${number} students. Can they make equal teams of ${b}, ${c}, or ${d}? Check each team size.`,
      keyPoints: [`Check divisibility of ${number}.`, "Write yes or no for each team size.", "Explain using factors."],
      modelAnswer: `Divide ${number} by each team size. A team size works only when the remainder is 0.`,
    };
  }

  if (chapter.number === 6) {
    const length = a + 8;
    const breadth = b + 3;

    if (variant === 0) {
      return {
        prompt: `A rectangular notice board is ${length} cm long and ${breadth} cm wide. Find its perimeter.`,
        keyPoints: ["Use perimeter of rectangle = 2 x (length + breadth).", `Perimeter = ${2 * (length + breadth)} cm.`, "Write the unit."],
        modelAnswer: `Perimeter = 2 x (${length} + ${breadth}) = ${2 * (length + breadth)} cm.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `A classroom floor is ${length} m by ${breadth} m. Find the area to be covered by mats.`,
        keyPoints: ["Use area of rectangle = length x breadth.", `Area = ${length * breadth} square metres.`, "Use square units."],
        modelAnswer: `Area = ${length} x ${breadth} = ${length * breadth} square metres.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `A square garden has side ${a + 4} m. Find the length of fencing needed and the area of grass inside.`,
        keyPoints: [`Perimeter = ${4 * (a + 4)} m.`, `Area = ${(a + 4) * (a + 4)} square metres.`, "Do not mix perimeter and area."],
        modelAnswer: `Fencing needed = 4 x ${a + 4} = ${4 * (a + 4)} m. Area = ${a + 4} x ${a + 4} = ${(a + 4) * (a + 4)} square metres.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `A table top needs unit-square stickers. It is ${c + 3} units long and ${d + 2} units wide. How many stickers are needed?`,
        keyPoints: ["Each unit square covers one square unit.", `Stickers needed = ${(c + 3) * (d + 2)}.`, "Use multiplication."],
        modelAnswer: `The number of unit-square stickers is ${c + 3} x ${d + 2} = ${(c + 3) * (d + 2)}.`,
      };
    }

    return {
      prompt: `Give one real-life example where you need perimeter and one where you need area. Explain the difference.`,
      keyPoints: ["Perimeter is boundary length.", "Area is surface covered.", selected.example],
      modelAnswer: `Fencing a garden uses perimeter because it goes around the boundary. Tiling a floor uses area because it covers the surface.`,
    };
  }

  if (chapter.number === 7) {
    const denominator = c + 4;
    const firstNumerator = b;
    const secondNumerator = Math.max(1, denominator - firstNumerator - 1);

    if (variant === 0) {
      return {
        prompt: `A roti is cut into ${denominator} equal parts. You eat ${firstNumerator} parts. What fraction is eaten and what fraction is left?`,
        keyPoints: [`Eaten fraction = ${firstNumerator}/${denominator}.`, `Left fraction = ${denominator - firstNumerator}/${denominator}.`, "Use equal parts."],
        modelAnswer: `The eaten fraction is ${firstNumerator}/${denominator}. The fraction left is ${denominator - firstNumerator}/${denominator}.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `Riya drinks ${firstNumerator}/${denominator} litre of juice and Aman drinks ${secondNumerator}/${denominator} litre. How much did they drink together?`,
        keyPoints: ["Denominators are same.", `Add numerators: ${firstNumerator + secondNumerator}/${denominator}.`, "Simplify if possible."],
        modelAnswer: `Together they drank ${firstNumerator}/${denominator} + ${secondNumerator}/${denominator} = ${firstNumerator + secondNumerator}/${denominator} litre.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `Compare ${firstNumerator}/${denominator} and ${secondNumerator}/${denominator}. Which is greater, and why?`,
        keyPoints: ["Same denominator means compare numerators.", "Greater numerator gives greater fraction.", selected.example],
        modelAnswer: `The denominators are the same, so compare ${firstNumerator} and ${secondNumerator}. The larger numerator gives the greater fraction.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `Write an equivalent fraction for ${firstNumerator}/${denominator} by multiplying numerator and denominator by ${d}.`,
        keyPoints: [`Numerator becomes ${firstNumerator * d}.`, `Denominator becomes ${denominator * d}.`, "Value stays the same."],
        modelAnswer: `${firstNumerator}/${denominator} = ${firstNumerator * d}/${denominator * d} when both numerator and denominator are multiplied by ${d}.`,
      };
    }

    return {
      prompt: `Create a real-life fraction problem about sharing food or stationery. Solve it using a diagram or clear steps.`,
      keyPoints: ["Mention the whole and equal parts.", "Write the fraction correctly.", "Show the solution steps."],
      modelAnswer: `A good answer defines the whole, splits it into equal parts, writes the fraction, and shows how much is used or left.`,
    };
  }

  if (chapter.number === 8) {
    const radius = b + 2;
    const segment = a + 5;

    if (variant === 0) {
      return {
        prompt: `Using a ruler, draw a line segment of ${segment} cm. Write the construction steps.`,
        keyPoints: [`Draw ${segment} cm accurately.`, "Use ruler markings from 0.", "Name the endpoints."],
        modelAnswer: `Mark one endpoint at 0 cm, mark another at ${segment} cm, and join them with a straight line segment.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `Draw a circle of radius ${radius} cm using a compass. Write what you will keep fixed and what you will rotate.`,
        keyPoints: [`Set compass opening to ${radius} cm.`, "Keep the needle fixed at the centre.", "Rotate the pencil arm."],
        modelAnswer: `Set the compass to ${radius} cm, place the needle at the centre, and rotate the pencil arm to draw the circle.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `A wheel drawing needs an arc. Explain how you would draw an arc with a compass.`,
        keyPoints: ["Fix the compass needle.", "Use the same radius while turning partly.", `Use ${selected.term}: ${selected.meaning}.`],
        modelAnswer: `Fix the needle at the centre, keep the compass opening unchanged, and turn the pencil only for part of the circle to make an arc.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `Copy a ${segment} cm line segment on another part of the page using a compass and ruler. Write the steps.`,
        keyPoints: ["Measure the original length with compass.", "Draw a fresh ray or line.", "Mark the same length from one endpoint."],
        modelAnswer: `Open the compass to the length of the original segment, draw a fresh line, and mark that same distance from the new endpoint.`,
      };
    }

    return {
      prompt: `List the tools needed for an accurate construction and write one safety or accuracy rule for each.`,
      keyPoints: ["Mention compass and ruler.", "Explain careful measurement.", "Follow construction steps."],
      modelAnswer: `Use a ruler for straight lines and measurement, and a compass for circles and arcs. Keep the ruler steady and do not change compass opening by mistake.`,
    };
  }

  if (chapter.number === 9) {
    if (variant === 0) {
      return {
        prompt: `Draw a rectangle and mark all its lines of symmetry. How many lines of symmetry does it have?`,
        keyPoints: ["A rectangle has 2 lines of symmetry.", "Mark vertical and horizontal middle lines.", "Do not count diagonals for a non-square rectangle."],
        modelAnswer: `A rectangle has 2 lines of symmetry: one vertical through the middle and one horizontal through the middle.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `A square tile pattern is turned by 90 degrees and still matches itself. What type of symmetry is shown?`,
        keyPoints: ["Turning symmetry is rotational symmetry.", "Mention 90 degrees.", selected.example],
        modelAnswer: `It shows rotational symmetry because the design matches after a 90 degree turn.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `Fold a paper shape to test symmetry. What must happen on both sides of the fold line?`,
        keyPoints: ["Both halves must match exactly.", "The fold line is the line of symmetry.", "Use reflection idea."],
        modelAnswer: `The two halves must cover each other exactly. The fold line is the line of symmetry.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `Design a rangoli with ${d} repeating parts around the centre. Explain how symmetry helps the design look balanced.`,
        keyPoints: [`Use ${d} repeated parts.`, "Explain balance around the centre.", "Mention reflection or rotation."],
        modelAnswer: `Repeating the same part around the centre creates balance. If the parts match after turning, the design has rotational symmetry.`,
      };
    }

    return {
      prompt: `Find two examples of symmetry at home or school and identify the line of symmetry in each.`,
      keyPoints: ["Give two real examples.", "Identify the line of symmetry.", "Explain matching halves."],
      modelAnswer: `Examples can include a butterfly picture, a leaf, a window, or a paper heart. The line of symmetry divides each into matching halves.`,
    };
  }

  if (chapter.number === 10) {
    const temp = -a;
    const change = b + 3;
    const finalTemp = temp + change;

    if (variant === 0) {
      return {
        prompt: `Morning temperature was ${temp} degree Celsius. By noon it increased by ${change} degrees. What was the noon temperature?`,
        keyPoints: [`Start at ${temp}.`, `Move ${change} steps to the right on the number line.`, `Noon temperature = ${finalTemp} degree Celsius.`],
        modelAnswer: `${temp} + ${change} = ${finalTemp}, so the noon temperature was ${finalTemp} degree Celsius.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `A lift is at floor ${-d}. It goes up ${a} floors. Which floor does it reach? Show on a number line.`,
        keyPoints: [`Start at ${-d}.`, `Move up ${a} steps.`, `It reaches floor ${-d + a}.`],
        modelAnswer: `Starting from ${-d} and moving up ${a} floors gives ${-d + a}.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `Compare ${-a} and ${-b}. Which integer is greater? Explain using distance from zero.`,
        keyPoints: ["On a number line, the number to the right is greater.", "For negative numbers, closer to zero is greater.", selected.example],
        modelAnswer: `The greater integer is the one closer to zero on the number line.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `A player loses ${a} points in round 1 and gains ${b + 5} points in round 2. What is the net score?`,
        keyPoints: [`Represent loss as -${a}.`, `Represent gain as +${b + 5}.`, `Net score = ${b + 5 - a}.`],
        modelAnswer: `The net score is -${a} + ${b + 5} = ${b + 5 - a}.`,
      };
    }

    return {
      prompt: `Write two real-life situations where negative numbers are useful and place one example on a number line.`,
      keyPoints: ["Use contexts such as temperature, floors, depth, loss, or debt.", "Mark zero clearly.", "Place the negative number to the left of zero."],
      modelAnswer: `Negative numbers can show temperatures below zero and basement floors. On a number line, a negative number is placed to the left of zero.`,
    };
  }

  if (chapter.number === 3) {
    const number = a * 100 + b * 10 + c;
    const rounded = Math.round(number / 100) * 100;

    if (variant === 0) {
      return {
        prompt: `In the number ${number}, what is the place value of ${b}? Create one more number with the same digit in a different place.`,
        keyPoints: [`${b} has place value ${b * 10}.`, "Mention tens place.", "Create a second number and compare place value."],
        modelAnswer: `In ${number}, ${b} is in the tens place, so its place value is ${b * 10}.`,
      };
    }

    if (variant === 1) {
      return {
        prompt: `Estimate ${number} to the nearest hundred and explain why estimation is useful while shopping.`,
        keyPoints: [`Nearest hundred is ${rounded}.`, "Use nearby hundred.", "Connect estimation to quick checking."],
        modelAnswer: `${number} is about ${rounded} to the nearest hundred. Estimation helps quickly check if a bill is reasonable.`,
      };
    }

    if (variant === 2) {
      return {
        prompt: `Make the greatest and smallest 3-digit numbers using ${a}, ${b}, and ${c} once each.`,
        keyPoints: ["Arrange digits in descending order for greatest.", "Arrange digits in ascending order for smallest.", "Use each digit once."],
        modelAnswer: `Use descending order for the greatest number and ascending order for the smallest number.`,
      };
    }

    if (variant === 3) {
      return {
        prompt: `Check whether ${a}${b}${a} is a palindrome. Explain the test.`,
        keyPoints: ["A palindrome reads the same both ways.", `The first and last digits are ${a}.`, "Compare reading left to right and right to left."],
        modelAnswer: `${a}${b}${a} is a palindrome because it reads the same from left to right and right to left.`,
      };
    }

    return {
      prompt: `Create a number puzzle using addition or subtraction. Solve it and explain the operation used.`,
      keyPoints: ["State the puzzle clearly.", "Show the operation.", `Use ${selected.term}: ${selected.meaning}.`],
      modelAnswer: `A complete answer creates a small number puzzle, solves it step by step, and names the operation used.`,
    };
  }

  return {
    prompt: `Create a practical daily-life problem using ${selected.term} from ${chapter.title}. Solve it with clear steps.`,
    keyPoints: [`Use ${selected.term}: ${selected.meaning}.`, "Write the given information.", "Show working and final answer."],
    modelAnswer: `A good answer uses ${selected.term} in a real situation, shows the working clearly, and ends with a final answer. Example idea: ${selected.example}.`,
  };
}

function mathsPracticalQuestions(chapter: Chapter, setNumber: number) {
  return Array.from({ length: 20 }, (_, index) => {
    const selected = termAt(chapter, index, setNumber + 3);
    const focus = rotate(chapter.focus, setNumber + index)[0];
    const details = mathsPracticalDetails(chapter, setNumber, index, selected, focus);

    return {
      id: `${chapter.id}-p${setNumber}-practical-${index + 1}`,
      ...details,
    };
  });
}

export function getQuestionPapers(chapter: Chapter): QuestionPaper[] {
  const termPool = subjectTermPool(chapter.subjectId);
  const examplePool = subjectExamplePool(chapter.subjectId);
  const paperCount = getPaperCountForChapter(chapter);

  return Array.from({ length: paperCount }, (_, paperIndex) => paperIndex + 1).map((setNumber) => {
    const mcqs: McqQuestion[] = Array.from({ length: 10 }, (_, index) => {
      const selected = termAt(chapter, index, setNumber);
      const useMeaning = index % 2 === 0;
      const correctAnswer = useMeaning ? selected.term : selected.example;

      return {
        id: `${chapter.id}-p${setNumber}-mcq-${index + 1}`,
        prompt: useMeaning
          ? `Which term best matches this meaning: ${selected.meaning}?`
          : `Which example is most closely linked with ${selected.term} in this chapter?`,
        options: options(correctAnswer, useMeaning ? termPool : examplePool, setNumber + index),
        correctAnswer,
        explanation: `${selected.term}: ${selected.meaning}. Example: ${selected.example}.`,
      };
    });

    const matchTerms = Array.from({ length: 5 }, (_, index) => termAt(chapter, index, setNumber));
    const matches: MatchQuestion[] = matchTerms.map((selected, index) => ({
      id: `${chapter.id}-p${setNumber}-match-${index + 1}`,
      left: selected.term,
      right: selected.meaning,
    }));

    const trueFalse: TrueFalseQuestion[] = Array.from({ length: 7 }, (_, index) => {
      const selected = termAt(chapter, index, setNumber);
      const other = termAt(chapter, index + 2, setNumber);
      const correctAnswer = index % 2 === 0;
      return {
        id: `${chapter.id}-p${setNumber}-tf-${index + 1}`,
        statement: correctAnswer
          ? `${selected.term} means ${selected.meaning}.`
          : `${selected.term} mainly means ${other.meaning}.`,
        correctAnswer,
        explanation: correctAnswer
          ? `${selected.term} is correctly matched.`
          : `${selected.term} means ${selected.meaning}, not ${other.meaning}.`,
      };
    });

    const blanks: FillBlankQuestion[] = Array.from({ length: 8 }, (_, index) => {
      const selected = termAt(chapter, index, setNumber + 1);
      return {
        id: `${chapter.id}-p${setNumber}-blank-${index + 1}`,
        prompt: `In ${chapter.title}, ______ means ${selected.meaning}.`,
        correctAnswer: selected.term,
        explanation: `${selected.term} is the correct term. Example: ${selected.example}.`,
      };
    });

    const shortAnswers: WrittenQuestion[] = Array.from({ length: 5 }, (_, index) => {
      const selected = termAt(chapter, index, setNumber + 2);
      return {
        id: `${chapter.id}-p${setNumber}-short-${index + 1}`,
        prompt: `Define ${selected.term} and give one example from the chapter.`,
        keyPoints: [selected.meaning, selected.example, `Use the term in the context of ${chapter.title}.`],
        modelAnswer: `${selected.term} means ${selected.meaning}. One example is ${selected.example}.`,
      };
    });

    const longAnswers: WrittenQuestion[] = Array.from({ length: 2 }, (_, index) => {
      const selectedTerms = Array.from({ length: 3 }, (_, termIndex) => termAt(chapter, index + termIndex + setNumber, setNumber));
      const focus = rotate(chapter.focus, setNumber + index).slice(0, 3);
      return {
        id: `${chapter.id}-p${setNumber}-long-${index + 1}`,
        prompt:
          index === 0
            ? `Explain the main ideas of ${chapter.title} using the terms ${selectedTerms.map((item) => item.term).join(", ")}.`
            : `How is ${chapter.title} useful in daily life or exam revision? Write a clear answer with examples.`,
        keyPoints: [...focus, ...selectedTerms.map((item) => `${item.term}: ${item.meaning}`)],
        modelAnswer: `${chapter.summary} Important points include ${focus.join("; ")}. Useful terms are ${selectedTerms
          .map((item) => `${item.term} (${item.meaning})`)
          .join(", ")}.`,
      };
    });

    return {
      id: `${chapter.id}-paper-${setNumber}`,
      chapterId: chapter.id,
      setNumber,
      title: `Practice Paper ${setNumber}`,
      mcqs,
      matches: chapter.subjectId === "maths" ? [] : matches,
      trueFalse: chapter.subjectId === "maths" ? [] : trueFalse,
      blanks: chapter.subjectId === "maths" ? [] : blanks,
      shortAnswers: chapter.subjectId === "maths" ? [] : shortAnswers,
      longAnswers: chapter.subjectId === "maths" ? [] : longAnswers,
      practicalQuestions: chapter.subjectId === "maths" ? mathsPracticalQuestions(chapter, setNumber) : undefined,
    };
  });
}

export function getSubjectProgressSummary(progress: { completedLessons: Record<string, string>; attempts: { topicId: string }[] }, subjectId: SubjectId) {
  const chapters = getSubjectById(subjectId)?.chapters ?? [];
  const completed = chapters.filter((item) => progress.completedLessons[item.id]).length;
  const attempted = chapters.filter((item) => progress.attempts.some((attempt) => attempt.topicId === item.id)).length;

  return {
    completed,
    attempted,
    total: chapters.length,
    percent: chapters.length ? Math.round(((completed + attempted) / (chapters.length * 2)) * 100) : 0,
  };
}
