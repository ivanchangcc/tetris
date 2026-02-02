# Tetris Game

A classic Tetris game implementation built with vanilla JavaScript, HTML5 Canvas, and CSS. This is a fully playable browser-based version of the iconic puzzle game.

## 🎮 Features

- **Classic Tetris Gameplay**: Drop, rotate, and clear lines with the traditional 7 tetromino pieces
- **Score System**: Track your current score and high score
- **High Score Persistence**: High scores are saved to browser localStorage
- **Smooth Controls**: Intuitive keyboard controls for movement and rotation
- **Visual Feedback**: Colorful pieces with a modern dark theme
- **Game Over Detection**: Automatic game over when pieces reach the top
- **Restart Functionality**: Easy restart with a single keypress

## 🎯 Game Controls

- **← (Left Arrow)**: Move piece left
- **→ (Right Arrow)**: Move piece right
- **↓ (Down Arrow)**: Drop piece down (faster fall)
- **↑ (Up Arrow)**: Rotate piece clockwise
- **Enter**: Start game
- **R**: Restart game (when game over) sd

## 📁 Project Structure

```
tetris/
├── index.html    # Main HTML structure
├── styles.css    # Styling and layout
├── tetris.js     # Game logic and rendering
└── README.md     # This documentation
```

## 📄 File Documentation

### `index.html`

The main HTML file that sets up the game structure and UI elements.

**Structure:**
- HTML5 document with proper meta tags for responsive design
- Links to external stylesheet (`styles.css`) and script (`tetris.js`)
- Game container with:
  - Title heading
  - Score display area (current score and high score)
  - Canvas element (300x600 pixels) for game rendering
  - Control instructions
  - Overlay for game start/game over messages

**Key Elements:**
- `#canvas`: The game board rendering area
- `#score`: Current score display
- `#high-score`: High score display
- `#overlay`: Modal overlay for game state messages
- `#overlay-text`: Text content for overlay messages

**Technical Details:**
- Canvas dimensions: 300px width × 600px height
- Semantic HTML5 structure
- Accessible markup with proper element IDs

---

### `styles.css`

Stylesheet providing the visual design and layout for the game.

**Design Theme:**
- Dark color scheme with deep blue backgrounds (`#1a1a2e`, `#16213e`)
- Modern, minimalist aesthetic
- Centered layout with flexbox
- Subtle shadows and rounded corners

**Key Styles:**

1. **Global Styles** (`*`)
   - Box-sizing set to border-box for consistent sizing

2. **Body** (`body`)
   - Full viewport height with flex centering
   - Dark background color (`#1a1a2e`)
   - System font stack for cross-platform consistency

3. **Container** (`.container`)
   - Relative positioning for overlay placement
   - Centered text alignment

4. **Game Area** (`.game-area`)
   - Flex column layout
   - Vertical spacing with gap property

5. **Canvas** (`#canvas`)
   - Block display
   - Dark background (`#16213e`)
   - Rounded corners (4px border-radius)
   - Box shadow for depth

6. **Overlay** (`.overlay`)
   - Absolute positioning covering entire container
   - Semi-transparent dark background (`rgba(0, 0, 0, 0.6)`)
   - Centered content with flexbox
   - Hidden by default (`.hidden` class)

**Color Palette:**
- Background: `#1a1a2e` (dark blue-gray)
- Canvas: `#16213e` (slightly lighter dark blue)
- Text: `#eee` (light gray)
- Overlay: `rgba(0, 0, 0, 0.6)` (semi-transparent black)

---

### `tetris.js`

The core game logic, rendering engine, and user input handling.

#### Constants

- **`COLS`**: 10 - Number of columns in the game board
- **`ROWS`**: 20 - Number of rows in the game board
- **`CELL_SIZE`**: 30 - Pixel size of each cell
- **`FALL_INTERVAL`**: 800 - Milliseconds between automatic piece drops

#### Data Structures

**`COLORS` Array:**
- Index 0: `null` (empty cell)
- Index 1-7: Color codes for each tetromino type:
  - I (cyan): `#00f5ff`
  - O (yellow): `#ffd700`
  - T (purple): `#9d4edd`
  - S (green): `#2dc653`
  - Z (red): `#e63946`
  - J (blue): `#4361ee`
  - L (orange): `#f77f00`

**`SHAPES` Array:**
- 2D arrays representing each tetromino shape
- Each shape is a matrix where non-zero values indicate filled cells
- Values correspond to color indices (1-7)

**Game State Variables:**
- `board`: 2D array (20×10) representing the game board
- `currentPiece`: Object containing active falling piece
- `score`: Current game score
- `highScore`: Best score (persisted in localStorage)
- `gameOver`: Boolean flag for game state
- `gameStarted`: Boolean flag for game initialization
- `fallIntervalId`: Timer ID for automatic piece falling

#### Core Functions

**`init()`**
- Initializes/resets the game board
- Resets score and game state flags
- Loads high score from localStorage
- Hides overlay
- Spawns first piece
- Starts automatic falling interval

**`spawnPiece()`**
- Randomly selects a tetromino type (1-7)
- Creates a new piece object with:
  - `shape`: Copy of the shape matrix
  - `x`: Centered horizontally
  - `y`: Top of board (0)
  - `color`: Type index
- Checks for collision (game over condition)
- Updates overlay if game over

**`collision(piece, x, y)`**
- Checks if a piece placement would cause a collision
- Validates boundaries (left, right, bottom)
- Checks for overlapping with existing board cells
- Returns `true` if collision detected

**`movePiece(dx, dy)`**
- Attempts to move the current piece
- Parameters: `dx` (horizontal delta), `dy` (vertical delta)
- Updates score when moving down (+1 point per cell)
- Updates high score if exceeded
- Returns `true` if move successful

**`rotatePiece()`**
- Rotates the current piece 90° clockwise
- Uses matrix transpose algorithm
- Reverts rotation if collision detected
- Formula: `rotated[i][j] = original[rows-1-j][i]`

**`lockPiece()`**
- Permanently places the current piece on the board
- Copies piece cells to board array
- Clears completed lines
- Spawns next piece

**`clearLines()`**
- Scans board from bottom to top
- Removes rows that are completely filled
- Shifts remaining rows down
- Scoring system:
  - 0 lines: 0 points
  - 1 line: 100 points
  - 2 lines: 300 points
  - 3 lines: 500 points
  - 4 lines: 800 points
- Updates high score

**`tick()`**
- Called by interval timer (every 800ms)
- Attempts to move piece down one cell
- Locks piece if movement fails
- Does nothing if game over

**`draw()`**
- Renders the game board using Canvas API
- Clears canvas with background color
- Draws locked pieces from board array
- Draws current falling piece
- Draws grid lines for visual clarity
- Uses `requestAnimationFrame` for smooth 60fps rendering

#### Event Handlers

**Keyboard Input (`keydown` event):**
- **Enter**: Starts new game (if not started or game over)
- **R**: Restarts game (if game over)
- **Arrow Keys**: Movement and rotation (only when game active)
  - Left/Right: Horizontal movement
  - Down: Soft drop (faster fall)
  - Up: Rotation

#### LocalStorage Integration

- **Key**: `'tetrisHighScore'`
- **Read**: On page load and game initialization
- **Write**: When game ends and high score is updated
- Stores high score as string, converts to integer when reading

#### Rendering Details

- **Cell Size**: 30×30 pixels
- **Canvas Size**: 300×600 pixels (10 cols × 20 rows × 30px)
- **Grid Lines**: Subtle white lines (`rgba(255,255,255,0.08)`)
- **Cell Padding**: 1px gap between cells for visual separation
- **Animation**: Continuous rendering via `requestAnimationFrame`

## 🚀 Getting Started

1. **Clone or download** this repository
2. **Open `index.html`** in a modern web browser
3. **Press Enter** to start the game
4. **Use arrow keys** to play

No build process or dependencies required - just open and play!

## 🎨 Customization

### Adjusting Game Speed

Edit `FALL_INTERVAL` in `tetris.js`:
```javascript
const FALL_INTERVAL = 800; // Lower = faster, Higher = slower
```

### Changing Board Size

Modify `COLS` and `ROWS` constants, and update canvas dimensions in `index.html`:
```javascript
const COLS = 10; // Width
const ROWS = 20; // Height
```

### Modifying Colors

Update the `COLORS` array in `tetris.js` to change piece colors.

### Adjusting Scoring

Modify the `points` array in the `clearLines()` function:
```javascript
const points = [0, 100, 300, 500, 800]; // Points for 0-4 lines
```

## 🐛 Known Limitations

- No "next piece" preview
- No level progression or speed increase
- No pause functionality
- No sound effects or music
- No touch controls for mobile devices

## 🔧 Browser Compatibility

- Modern browsers with Canvas API support
- Requires JavaScript enabled
- Uses localStorage for high score persistence

## 📝 License

This is a personal project implementation of Tetris. Tetris is a trademark of The Tetris Company.

## 👨‍💻 Development Notes

This is a minimal viable product (MVP) implementation focusing on core Tetris mechanics:
- Piece spawning and movement
- Collision detection
- Line clearing
- Score tracking
- Game over detection

The code is structured for readability and maintainability, with clear separation of concerns between rendering, game logic, and user input.
