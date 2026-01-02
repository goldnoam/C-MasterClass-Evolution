
import { Category, Difficulty, Topic } from './types';

export const CURRICULUM: Topic[] = [
  {
    id: 'cpp-basics',
    title: 'Variables & Flow Control',
    category: Category.FUNDAMENTALS,
    difficulty: Difficulty.BEGINNER,
    summary: 'Master the building blocks: data types, conditionals, and loops.',
    detailedContent: `
# Variables & Flow Control in C++

Variables are storage locations in memory. In C++, you must declare a type for every variable.

## Primitive Types
- \`int\`: Integers (e.g., 42)
- \`double\`: Floating-point numbers (e.g., 3.14)
- \`char\`: Single characters (e.g., 'A')
- \`bool\`: Boolean values (\`true\` or \`false\`)

## Control Flow
Control the execution path using:
- \`if / else\`: Conditional branching
- \`for\`: Iterating over a range
- \`while\`: Repeating as long as a condition is met
- \`switch\`: Multi-way branching based on discrete values

### Best Practices
Always initialize variables. Prefer \`const\` or \`constexpr\` for values that don't change.
`,
    initialCode: `#include <iostream>\n\nint main() {\n    int userAge = 25;\n    if (userAge >= 18) {\n        std::cout << "You are eligible to vote." << std::endl;\n    } else {\n        std::cout << "You must be 18 to vote." << std::endl;\n    }\n    return 0;\n}`,
    examples: [
      { name: "Switch Statement", code: `#include <iostream>\n\nint main() {\n    int day = 3;\n    switch(day) {\n        case 1: std::cout << "Monday"; break;\n        case 2: std::cout << "Tuesday"; break;\n        case 3: std::cout << "Wednesday"; break;\n        default: std::cout << "Invalid"; break;\n    }\n    return 0;\n}` }
    ]
  },
  {
    id: 'pointers-refs',
    title: 'Pointers & References',
    category: Category.FUNDAMENTALS,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Understand memory addresses, dereferencing, and the power of references.',
    detailedContent: `
# Pointers & References

C++ gives you direct control over memory.

## Pointers
A pointer is a variable that stores the memory address of another variable.
\`\`\`cpp
int x = 10;
int* ptr = &x; // ptr holds address of x
\`\`\`

## References
A reference is an alias for an existing variable. It must be initialized when declared and cannot be changed to refer to another variable.
\`\`\`cpp
int x = 10;
int& ref = x; // ref is another name for x
\`\`\`

### When to use what?
Use references by default for function parameters to avoid copying. Use pointers when you need nullability or re-assignment.
`,
    initialCode: `#include <iostream>\n\nint main() {\n    int score = 100;\n    int* p = &score;\n    int& r = score;\n    std::cout << "Pointer: " << *p << "\\nReference: " << r << std::endl;\n    return 0;\n}`
  },
  {
    id: 'cpp26-placeholders',
    title: 'C++26: Placeholder Variables',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.INTERMEDIATE,
    standard: 'C++26',
    summary: 'Use underscore "_" as a nameless placeholder to ignore unused variables without collisions.',
    detailedContent: `
# C++26 Placeholder Variables (P2169)

In C++26, you can use the underscore \`_\` as a name for variables that you intend to ignore.

## Why use placeholders?
1. **Clarity**: It signals to readers (and the compiler) that the variable is intentionally unused.
2. **Conflict Avoidance**: You can have multiple placeholders in the same scope without name collisions.
3. **Structured Bindings**: Perfect for ignoring parts of a returned tuple or struct.

\`\`\`cpp
// Prior to C++26, you'd get "unused variable" warnings or conflicts
auto [id, _] = get_user();
auto [status, _] = get_connection(); // ERROR in C++23, OK in C++26
\`\`\`

[References: P2169R4](https://wg21.link/p2169)
`,
    initialCode: `#include <iostream>\n#include <utility>\n\nint main() {\n    auto [id, _] = std::make_pair(101, "Admin");\n    auto [val, _] = std::make_pair(202, "User"); // Valid in C++26\n    std::cout << "ID: " << id << std::endl;\n    return 0;\n}`
  },
  {
    id: 'cpp26-contracts',
    title: 'C++26: Contracts',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.EXPERT,
    standard: 'C++26',
    summary: 'Formalize preconditions, postconditions, and assertions in the language for better safety.',
    detailedContent: `
# C++26 Contracts (P2900)

Contracts allow you to specify formal constraints on function inputs, outputs, and internal state.

## Syntax
- \`[[pre: condition]]\`: Precondition. Must be true before the function starts.
- \`[[post: condition]]\`: Postcondition. Must be true after the function completes.
- \`[[assert: condition]]\`: In-function assertion.

\`\`\`cpp
int divide(int a, int b) 
  [[pre: b != 0]]
  [[post res: res == a / b]] 
{
    return a / b;
}
\`\`\`

Contracts improve code safety and can assist compiler optimizations by defining legal states.
`,
    initialCode: `#include <iostream>\n\nint main() {\n    // Contract syntax (Conceptual until full C++26 support)\n    std::cout << "C++26 Contracts will revolutionize safety." << std::endl;\n    return 0;\n}`
  }
];
