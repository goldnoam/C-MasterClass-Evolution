
import { Category, Difficulty, Topic } from './types';

export const CURRICULUM: Topic[] = [
  {
    id: 'cpp-basics',
    title: 'Variables & Flow Control',
    category: Category.FUNDAMENTALS,
    difficulty: Difficulty.BEGINNER,
    summary: 'Master the building blocks: data types, conditionals, and loops.',
    initialCode: `#include <iostream>\n\nint main() {\n    // Use descriptive variable names for clarity\n    int userAge = 25;\n\n    // Simple conditional logic\n    if (userAge >= 18) {\n        std::cout << "You are eligible to vote." << std::endl;\n    } else {\n        std::cout << "You must be 18 to vote." << std::endl;\n    }\n\n    return 0;\n}`,
    examples: [
      { 
        name: "Switch Statement", 
        code: `#include <iostream>\n\nint main() {\n    int dayOfWeek = 3;\n\n    // Switch statements are efficient for discrete values\n    switch(dayOfWeek) {\n        case 1: std::cout << "Monday"; break;\n        case 2: std::cout << "Tuesday"; break;\n        case 3: std::cout << "Wednesday"; break;\n        default: std::cout << "Weekend or invalid day"; break;\n    }\n    return 0;\n}` 
      },
      { 
        name: "While Loop", 
        code: `#include <iostream>\n\nint main() {\n    int counter = 0;\n    const int maxIterations = 5;\n\n    // Iterate while the condition is true\n    while(counter < maxIterations) {\n        std::cout << "Step: " << counter << std::endl;\n        counter++;\n    }\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'pointers-refs',
    title: 'Pointers & References',
    category: Category.FUNDAMENTALS,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Understand memory addresses, dereferencing, and the power of references.',
    initialCode: `#include <iostream>\n\nint main() {\n    int originalScore = 100;\n\n    // Pointers store the memory address of a variable\n    int* scorePointer = &originalScore;\n\n    // References act as an alias for the same variable\n    int& scoreReference = originalScore;\n\n    std::cout << "Value via Pointer: " << *scorePointer << std::endl;\n    std::cout << "Value via Reference: " << scoreReference << std::endl;\n\n    return 0;\n}`,
    examples: [
      { 
        name: "Ref as Parameter", 
        code: `#include <iostream>\n\n// Pass by reference avoids unnecessary copying and allows modification\nvoid incrementScore(int& scoreToModify) {\n    scoreToModify += 10;\n}\n\nint main() {\n    int currentScore = 50;\n    incrementScore(currentScore);\n    std::cout << "Updated Score: " << currentScore << std::endl;\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'cpp-classes',
    title: 'Classes & RAII',
    category: Category.FUNDAMENTALS,
    difficulty: Difficulty.INTERMEDIATE,
    summary: 'Resource Acquisition Is Initialization: The core of C++ memory management.',
    initialCode: `#include <iostream>\n#include <string>\n\n// RAII ensures resources are cleaned up when the object goes out of scope\nclass FileSystemHandler {\npublic:\n    FileSystemHandler() { \n        std::cout << "[RAII] Resource acquired" << std::endl; \n    }\n    ~FileSystemHandler() { \n        std::cout << "[RAII] Resource automatically released" << std::endl; \n    }\n};\n\nint main() {\n    {\n        FileSystemHandler handlerInstance;\n        // handlerInstance is destroyed here, and its destructor is called\n    }\n    return 0;\n}`,
    examples: [
      { 
        name: "Constructor Overloading", 
        code: `#include <iostream>\n#include <string>\n\nclass GameCharacter {\n    std::string characterName;\npublic:\n    // Default constructor using member initializer list\n    GameCharacter() : characterName("Unknown Warrior") {}\n\n    // Parameterized constructor\n    GameCharacter(std::string name) : characterName(name) {}\n\n    void introduce() {\n        std::cout << "I am " << characterName << std::endl;\n    }\n};\n\nint main() {\n    GameCharacter defaultHero;\n    GameCharacter customHero("Arthas");\n\n    defaultHero.introduce();\n    customHero.introduce();\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'cpp17-features',
    title: 'C++17: Modernization',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.INTERMEDIATE,
    standard: 'C++17',
    summary: 'Structured bindings, std::optional, and std::variant.',
    initialCode: `#include <iostream>\n#include <optional>\n#include <string>\n\n// std::optional represents a value that might not exist\nstd::optional<std::string> fetchUsername(bool isSuccessful) {\n    if (isSuccessful) return "CppWizard99";\n    return std::nullopt;\n}\n\nint main() {\n    auto maybeName = fetchUsername(true);\n    \n    if (maybeName.has_value()) {\n        std::cout << "User: " << maybeName.value() << std::endl;\n    }\n    return 0;\n}`,
    examples: [
      { 
        name: "Structured Bindings", 
        code: `#include <iostream>\n#include <map>\n#include <string>\n\nint main() {\n    std::map<int, std::string> errorCodeMap = {{404, "Not Found"}, {500, "Internal Error"}};\n\n    // Decompose a pair directly into key and value variables\n    for (auto const& [statusID, statusMessage] : errorCodeMap) {\n        std::cout << "Code " << statusID << ": " << statusMessage << std::endl;\n    }\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'cpp20-concepts',
    title: 'C++20: Concepts & Constraints',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.ADVANCED,
    standard: 'C++20',
    summary: 'Restricting template parameters for clearer error messages and better code intent.',
    initialCode: `#include <iostream>\n#include <concepts>\n\n// Define a concept to constrain template parameters\ntemplate <typename T>\nconcept NumericType = std::integral<T> || std::floating_point<T>;\n\n// Use the concept to restrict calculateSum\ntemplate <NumericType T>\nT calculateSum(T firstValue, T secondValue) {\n    return firstValue + secondValue;\n}\n\nint main() {\n    std::cout << "Integer Sum: " << calculateSum(10, 20) << std::endl;\n    std::cout << "Double Sum: " << calculateSum(5.5, 4.5) << std::endl;\n    return 0;\n}`,
    examples: [
      { 
        name: "Requires Expression", 
        code: `#include <iostream>\n#include <concepts>\n\n// Check if a type supports the '<<' operator\ntemplate<typename T>\nconcept Printable = requires(T objectInstance) {\n    std::cout << objectInstance;\n};\n\nvoid printObject(Printable auto object) {\n    std::cout << "Printing: " << object << std::endl;\n}\n\nint main() {\n    printObject(42);\n    printObject("C++ Concepts are powerful!");\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'cpp20-ranges',
    title: 'C++20: Ranges Library',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.ADVANCED,
    standard: 'C++20',
    summary: 'Composable and lazy algorithms for sequence manipulation.',
    initialCode: `#include <iostream>\n#include <vector>\n#include <ranges>\n#include <algorithm>\n\nint main() {\n    std::vector<int> inputNumbers = {1, 2, 3, 4, 5, 6};\n\n    // Use the pipe operator to compose views lazily\n    auto processedEvenSquares = inputNumbers \n        | std::views::filter([](int n) { return n % 2 == 0; }) // Get evens\n        | std::views::transform([](int n) { return n * n; }); // Square them\n\n    for (int squareValue : processedEvenSquares) {\n        std::cout << squareValue << " ";\n    }\n    return 0;\n}`,
    examples: [
      { 
        name: "Take View", 
        code: `#include <iostream>\n#include <vector>\n#include <ranges>\n\nint main() {\n    std::vector<int> sensorData = {10, 20, 30, 40, 50};\n\n    // Only take the first 3 elements\n    for (int dataPoint : sensorData | std::views::take(3)) {\n        std::cout << dataPoint << " ";\n    }\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'cpp23-expected',
    title: 'C++23: std::expected',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.EXPERT,
    standard: 'C++23',
    summary: 'Modern error handling without exceptions using functional paradigms.',
    initialCode: `#include <iostream>\n#include <expected>\n#include <string>\n\n// std::expected either contains a value or an error\nstd::expected<int, std::string> parseStringToInteger(const std::string& inputString) {\n    if (inputString == "42") return 42;\n    return std::unexpected("Conversion failed: Invalid format");\n}\n\nint main() {\n    auto parseResult = parseStringToInteger("10");\n    \n    if (parseResult.has_value()) {\n        std::cout << "Parsed value: " << parseResult.value() << std::endl;\n    } else {\n        std::cerr << "Error: " << parseResult.error() << std::endl;\n    }\n    return 0;\n}`,
    examples: [
      { 
        name: "Chain with value_or", 
        code: `#include <iostream>\n#include <expected>\n#include <string>\n\nint main() {\n    std::expected<int, std::string> operationResult = std::unexpected("Operation failed");\n\n    // Provide a fallback value if the expected contains an error\n    int finalValue = operationResult.value_or(0);\n    std::cout << "Final Result: " << finalValue << std::endl;\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'cpp26-reflection',
    title: 'C++26: Static Reflection',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.EXPERT,
    standard: 'C++26',
    summary: 'Transformative compile-time introspection. Inspect types, members, and metadata programmatically.',
    initialCode: `#include <iostream>\n#include <experimental/meta>\n\n/* \n * C++26 STATIC REFLECTION (Proposed P2996)\n */\n\nstruct SystemAccount {\n    int accountID;\n    std::string accountName;\n};\n\nint main() {\n    // Reflection allows us to iterate over struct members at compile-time\n    std::cout << "C++26 Static Reflection sandbox initialized." << std::endl;\n    return 0;\n}`,
    examples: [
      { 
        name: "Stringify Enum", 
        code: `// With reflection, converting enums to strings becomes easy:\n// enum class Color { Red, Blue };\n// std::string name = std::meta::name_of(^Color::Red); // Result: "Red"\n\nint main() {\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'cpp26-pack-indexing',
    title: 'C++26: Pack Indexing',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.EXPERT,
    standard: 'C++26',
    summary: 'Directly access elements of a variadic template pack using index notation.',
    initialCode: `#include <iostream>\n#include <string>\n\n// C++26 Pack Indexing (P2662)\ntemplate <typename... T>\nauto extractThirdArgument(T... argumentPack) {\n    // Directly access index 2 using the new pack indexing syntax\n    return argumentPack...[2];\n}\n\nint main() {\n    auto extractedValue = extractThirdArgument(1, 2.5, "Success Message", 42);\n    std::cout << "The third argument is: " << extractedValue << std::endl;\n    return 0;\n}`,
    examples: [
      { 
        name: "Type Indexing", 
        code: `// You can also index into the type pack itself\ntemplate <size_t I, typename... Ts>\nusing getNthType = Ts...[I];\n\nint main() {\n    getNthType<1, int, double, char> myPrecisionValue = 3.14159;\n    return 0;\n}` 
      }
    ]
  },
  {
    id: 'cpp26-contracts',
    title: 'C++26: Contracts',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.EXPERT,
    standard: 'C++26',
    summary: 'Formalize preconditions, postconditions, and assertions in the language for better safety and optimization.',
    initialCode: `#include <iostream>\n\n// C++26 Contracts (Proposed P2900)\n// [[pre]]: Precondition - must be true before calling\n// [[post]]: Postcondition - must be true after return\ndouble performDivision(double dividend, double divisor)\n  [[pre: divisor != 0.0]]\n  [[post divisionResult: divisionResult == dividend / divisor]]\n{\n    return dividend / divisor;\n}\n\nint main() {\n    std::cout << "Division Result: " << performDivision(100.0, 5.0) << std::endl;\n    return 0;\n}`,
    examples: [
      { 
        name: "Assertion", 
        code: `void processData(int dataSize) {\n    // Assertions check invariants within the function body\n    [[assert: dataSize > 0]];\n    // ... processing ...\n}` 
      }
    ]
  },
  {
    id: 'cpp26-placeholders',
    title: 'C++26: Placeholder Variables',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.INTERMEDIATE,
    standard: 'C++26',
    summary: 'Use underscore "_" as a nameless placeholder to ignore unused variables without collisions.',
    initialCode: `#include <iostream>\n#include <string>\n#include <utility>\n\nint main() {\n    // C++26 allows multiple "_" placeholders in the same scope (P2169)\n    auto [accountID, _] = std::make_pair(101, "Admin User");\n    auto [transactionAmount, _] = std::make_pair(5000, "USD");\n\n    std::cout << "Processing Account ID: " << accountID << std::endl;\n    std::cout << "Amount: " << transactionAmount << std::endl;\n\n    return 0;\n}`,
  },
  {
    id: 'cpp26-hazard-rcu',
    title: 'C++26: Hazard Pointers and RCU',
    category: Category.MODERN_CPP,
    difficulty: Difficulty.EXPERT,
    standard: 'C++26',
    summary: 'Advanced concurrent memory reclamation techniques (P2530/P2545) to enable lock-free high-performance data structures safely.',
    initialCode: `#include <rcu>\n#include <hazard_pointer>\n#include <iostream>\n\nstruct SharedData {\n    int value;\n};\n\nint main() {\n    std::cout << "Concurrent memory safety via RCU/Hazard Pointers enabled." << std::endl;\n    return 0;\n}`,
  },
  {
    id: 'strategy-pattern',
    title: 'Strategy Design Pattern',
    category: Category.DESIGN_PATTERNS,
    difficulty: Difficulty.ADVANCED,
    summary: 'Encapsulate algorithms and make them interchangeable at runtime.',
    initialCode: `#include <iostream>\n#include <memory>\n\nclass IPaymentStrategy {\npublic:\n    virtual void executeTransaction(double amountToCharge) = 0;\n    virtual ~IPaymentStrategy() = default;\n};\n\nclass CreditCardProvider : public IPaymentStrategy {\npublic:\n    void executeTransaction(double amountToCharge) override {\n        std::cout << "[Strategy] Charging $" << amountToCharge << " via secure Credit Card gateway." << std::endl;\n    }\n};\n\nint main() {\n    std::unique_ptr<IPaymentStrategy> activePaymentMethod = std::make_unique<CreditCardProvider>();\n    activePaymentMethod->executeTransaction(99.99);\n    return 0;\n}`,
    examples: [
      { 
        name: "PayPal Strategy", 
        code: `#include <iostream>\n#include <memory>\n\nclass PayPalGateway : public IPaymentStrategy {\npublic:\n    void executeTransaction(double amountToCharge) override {\n        std::cout << "[Strategy] Charging $" << amountToCharge << " via PayPal digital wallet." << std::endl;\n    }\n};` 
      }
    ]
  },
  {
    id: 'observer-pattern',
    title: 'Observer Design Pattern',
    category: Category.DESIGN_PATTERNS,
    difficulty: Difficulty.ADVANCED,
    summary: 'Define a one-to-many dependency between objects so that when one object changes state, all its dependents are notified.',
    initialCode: `#include <iostream>\n#include <vector>\n\nclass IEventSubscriber {\npublic:\n    virtual void onEventPublished(int eventID) = 0;\n    virtual ~IEventSubscriber() = default;\n};\n\nclass NewsBroadcaster {\n    std::vector<IEventSubscriber*> subscriberRegistry;\npublic:\n    void registerSubscriber(IEventSubscriber* newSubscriber) {\n        subscriberRegistry.push_back(newSubscriber);\n    }\n\n    void publishBreakingNews(int newsArticleID) {\n        for (auto subscriber : subscriberRegistry) {\n            subscriber->onEventPublished(newsArticleID);\n        }\n    }\n};\n\nclass MobileNewsApp : public IEventSubscriber {\npublic:\n    void onEventPublished(int newsArticleID) override {\n        std::cout << "Mobile App: Received article #" << newsArticleID << std::endl;\n    }\n};\n\nint main() {\n    NewsBroadcaster globalAgency;\n    MobileNewsApp localUserDevice;\n    globalAgency.registerSubscriber(&localUserDevice);\n    globalAgency.publishBreakingNews(505);\n    return 0;\n}`,
  },
  {
    id: 'adapter-pattern',
    title: 'Adapter Design Pattern',
    category: Category.DESIGN_PATTERNS,
    difficulty: Difficulty.ADVANCED,
    summary: 'Allow incompatible interfaces to work together by wrapping an existing class with a new interface.',
    initialCode: `#include <iostream>\n#include <string>\n\nclass LegacyReportingSystem {\npublic:\n    void generateObsoleteTextReport() {\n        std::cout << "[Adaptee] Legacy report generation." << std::endl;\n    }\n};\n\nclass IModernDataAnalyzer {\npublic:\n    virtual void analyzeData() = 0;\n    virtual ~IModernDataAnalyzer() = default;\n};\n\nclass SystemBridgeAdapter : public IModernDataAnalyzer {\n    LegacyReportingSystem* wrappedLegacySystem;\npublic:\n    SystemBridgeAdapter(LegacyReportingSystem* legacyInstance) \n        : wrappedLegacySystem(legacyInstance) {}\n\n    void analyzeData() override {\n        wrappedLegacySystem->generateObsoleteTextReport();\n    }\n};\n\nint main() {\n    LegacyReportingSystem oldHardware;\n    std::unique_ptr<IModernDataAnalyzer> modernAnalyzer = std::make_unique<SystemBridgeAdapter>(&oldHardware);\n    modernAnalyzer->analyzeData();\n    return 0;\n}`,
  },
  {
    id: 'template-meta',
    title: 'Template Metaprogramming',
    category: Category.ADVANCED_TOPICS,
    difficulty: Difficulty.EXPERT,
    summary: 'Writing code that generates code at compile time.',
    initialCode: `#include <iostream>\n\ntemplate<int N>\nstruct RecursiveFactorial {\n    static const int result = N * RecursiveFactorial<N - 1>::result;\n};\n\ntemplate<>\nstruct RecursiveFactorial<0> {\n    static const int result = 1;\n};\n\nint main() {\n    std::cout << "Factorial of 5: " << RecursiveFactorial<5>::result << std::endl;\n    return 0;\n}`,
    examples: [
      { 
        name: "Type Traits", 
        code: `#include <iostream>\n\ntemplate<typename T>\nstruct IsPointerType {\n    static const bool value = false;\n};\n\ntemplate<typename T>\nstruct IsPointerType<T*> {\n    static const bool value = true;\n};\n\nint main() {\n    std::cout << std::boolalpha << "Is int* a pointer? " << IsPointerType<int*>::value << std::endl;\n    return 0;\n}` 
      }
    ]
  }
];
