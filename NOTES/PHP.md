https://github.com/zsoro2/php-interview-questions#interface-vs-abstract-class-tell-me-the-diference


# 11 jun 2026

PSR and php internals
psr provides guidelines on coding style, logger interface, http cache, and more
phpstan & larastan

# 29 june 2026


# 11 july 2026
implode('', $arr) => string
explode('', $str) => $arr
str_split($str, 1) => $arr

strlen($sr) for string length
count($arr) for array length
(int) "hello"
(string) 3;

# 16 july 2026
Interfaces, Traits classes used in codeigniter

Installing dependencies:
(require)
composer require phpunit/phpunit
composer install --no-dev --optimize-autoloader
(require-dev)
composer require --dev phpunit/phpunit
composer install --optimize-autoloader


# 3 aug 2026
let's actually start: php cookbook

# PHP Data types:
1. Atomic types: buildin types
- scaler types: bool, int float, string
- array, object, resource, never, void, relative class types(self,static, parent), null
2. user defined types: interfaces, classes, enumeration
- callable

- defined('constant') checks if constant is definied or not true/false
- empty($var or string or number array etc) checks if variable is empty or not true/false\
- destructuring but not like js: [,$one,,] = $arr1
- $x == $y Equal Returns true if both values are the same after coercing into the same type
- $x === $y Identical Returns true if both values are the same and are of the same type
- $x <=> $y Spaceship Returns 0 is both values are equal, 1 if $x is greater, or -1 if $y is greater
- casting (int) $var, it supports (ing), (bool), (float), (string), (array), (object)
- null coalescing operator : if a variable exists and not null: $var ?? 'default'
- ternary operator: if this than that else default condition ? var : default
- isset($var) true if variable exists and it's value is not null
- @ is used for temporarily supress the warninings. 
$fp = @fopen('robots.txt','r');
$fp = @$var1;
echo "completed";

| Feature | include | use |
|---|---|---|
| Primary Job | Reads and executes a physical file. | Creates a shortcut/alias for a class namespace. |
| Argument | A file path string ('path/to/file.php'). | A fully qualified class path (App\Models\User). |
| Missing Target | Throws a Warning (script continues). | Throws a Fatal Error only when you try to instantiate the missing class. |
| Laravel Context | Used inside Blade templates (@include) or raw PHP config. | Used at the top of Controllers, Models, and web.php routes. |

- const abc = "world"; echo abc;
### funtions
- passing variables by reference: function fun1(&$var1) 
- default parameters: function fun1(&$var1, $var2 = "hello")
- declare(strict_types=1); 
- javascript has closures for retaining values that returns functions but php has static keyword
const increment = (function() {
    let count = 0; // Initialized only once, exactly like PHP's static
    
    return function() {
        return count++; // Returns current value, then increments it
    };
})();
vs 
function increment()
{
    static $count = 0;
    return $count++;
}
static function increment()
{
    $count = 0;
    return $count++;
}
- javascript closures vs php closures:
function outer() {
    let message = "Hello from JS";
    
    return function inner() {
        console.log(message); // Automatically accessible
    };
}
vs 
function outer() {
    $message = "Hello from PHP";
    
    // Will crash with "Undefined variable" if you omit 'use ($message)'
    return function() use ($message) {
        echo $message; 
    };
}

- callback means passing function as argument to another function
- javascript(asynchronous & event driven) vs php(synchronous & blocking) callbacks
console.log("Start");
// Asynchronous callback
setTimeout(() => {
    console.log("Inside Callback (Happens after 1 second)");
}, 1000);
console.log("End");
vs 
echo "Start\n";
$callback = function() {
    sleep(1); // Simulating a 1-second delay
    echo "Inside Callback\n";
};
// Synchronous execution
call_user_func($callback);
echo "End\n";

- length of array: count($arr), length of string: strlen($str)
- javascript length of array & string $var1.length

### string

- 300 hours 150 hours 
- sql 100 hours
- substr(string $string, int $offset, ?int $length = null): string
function substr_replace(
array|string $string,
array|string $replace,
array|int $offset,
array|int|null $length = null
): string


tender details: deeplink share as it is
services: dynamic with seperate table for managing the contact support, each service will have different contact person
seller info: only include what's there, and send list of things not there
transit insurance: admin panel page also with email
seller info gst verify: once a month or 3 month update records of all active user at a time and don't call apis on user 



