
# Date: 26 May 2026 1. Service container internals
Laravel's api flow journey
request => apache/nginx => public/index.php(checks maintenance mode, loads the autoloader, bootstrap the bootstrap/app.php and handle the request) => create instance of laravel app => HTTP kernel or the console kernel, using the handleRequest or handleCommand methods of the application instance configure error handling, configure logging, detect the application environment => service providers bootstrapping all of the framework's various components, such as the database, queue, validation, and routing components => middleware => route => controller method => response => middleware => HTTP kernel's handle method returns the response object to the handleRequest of the application instance, and this method calls the send method on the returned response. The send method sends the response content to the user's web browser.

nodejs: request -> server.js -> app.js -> middleware -> route -> controller method -> response

# Date: 10 June 2026

laravel request -> parameter vs query vs data

data:
$request->all()
$request->name

query:
$request->query("key");
$request->input("key");


parameter:
direct


> and getting the header data in controller method:
$request->header('name');

> getting bearer token:
$request->bearerToken();



## Next will be Psr

# 11 june 2026

indexing in migrations

$table->index('name');
$table->index('name', 'idx_name');

unique index(no duplicates):
$table->unique('name');
$table->unique('name', 'idx_name');


without locking the table while creating index:
$table->string('email')->unique()->online();

drop index:
$table->dropIndex('geo_state_index');	
$table->dropUnique('geo_state_index');	

# 20 june 2026
frontend options for laravel:
1. blade (simple but not dynamic)
2. livewire with alpine (like react)
3. react/vue/svelte + inertia

Dependency injection: class dependencies are "injected" into the class via the constructor or, in some cases, "setter" methods.
bindings means "When somebody asks for X, give them Y"
$this->app->bind(
    AppleMusic::class,
    function ($app) {
        return new AppleMusic(
            config('services.apple.key')
        );
    }
);

A Service Provider is where you register binding
bind() vs singleton()
bind Creates a new object every time. singleton Create once and reuse.
so $a = app(AppleMusic::class); & $b = app(AppleMusic::class); and $a === $b false
but true for singleton
amd resolving means calling $a = app(AppleMusic::class);

Service Provider
        ↓ registers
Bindings
        ↓ stored in
Service Container
        ↓ resolves
Objects/Services
        ↓ injected into
Controllers, Jobs, Commands, Middleware, etc.

# 24 june 2026
module system in laravel

# 27 june 2026
making a module using package "nwidart/laravel-modules"
php artisan module:make Primagen                                                                                                                                                   ─╯

   INFO  Creating module: [Primagen].  

  Generating file Modules/Primagen/module.json ......................................................................................... 1.26ms DONE
  Generating file Modules/Primagen/routes/web.php ...................................................................................... 1.09ms DONE
  Generating file Modules/Primagen/routes/api.php ...................................................................................... 0.39ms DONE
  Generating file Modules/Primagen/resources/views/index.blade.php ..................................................................... 0.45ms DONE
  Generating file Modules/Primagen/resources/views/components/layouts/master.blade.php ................................................. 0.59ms DONE
  Generating file Modules/Primagen/config/config.php ................................................................................... 1.24ms DONE
  Generating file Modules/Primagen/composer.json ....................................................................................... 0.65ms DONE
  Generating file Modules/Primagen/resources/assets/js/app.js .......................................................................... 0.28ms DONE
  Generating file Modules/Primagen/resources/assets/sass/app.scss ...................................................................... 0.24ms DONE
  Generating file Modules/Primagen/vite.config.js ...................................................................................... 0.24ms DONE
  Generating file Modules/Primagen/package.json ........................................................................................ 0.58ms DONE
  Generating file Modules/Primagen/database/seeders/PrimagenDatabaseSeeder.php ......................................................... 0.33ms DONE
  Generating file Modules/Primagen/app/Providers/PrimagenServiceProvider.php ........................................................... 0.19ms DONE
  Generating file Modules/Primagen/app/Providers/EventServiceProvider.php .............................................................. 0.21ms DONE
  Generating file Modules/Primagen/app/Providers/RouteServiceProvider.php .............................................................. 0.18ms DONE
  Generating file Modules/Primagen/app/Http/Controllers/PrimagenController.php ......................................................... 0.29ms DONE

   INFO  Module [Primagen] created successfully. 

most important flow i can see here is :
adding these things in composer.json:
 "extra": {
        "laravel": {
            "dont-discover": [],
            "installer": {
                "post-create-project": []
            }
        },
        "merge-plugin": {
            "include": [
                "Modules/*/composer.json"
            ]
        }
    },


# 2 july 2026
## Laravel events and concurrency\

## Laravel Processes
- Illuminate\Support\Facades\Process
- for running terminal commands and scripts
- Process::run() will give object which will have funtions:
$result->command();
$result->successful();
$result->failed();
$result->output();
$result->errorOutput();
$result->exitCode();
- with input Process::input("david")->run("where");

---
and also we have can have every type of file inside each module with just a command


# 9 july 2026
queue connection database sync redis

# 11 july 2026
 php artisan list for all commands
 

# 17 july 2026

Laravel Cache:
$lock = Cache::lock("string",10); //10 seconds
$lock->get() // true or false


calling apis in artisan:

# 22 july 2026
using multiple databases in laravel
in config/database.php connections > driver same or different and env values 
- eloquent 
DB::table('users')
DB::connection('crm')->table('users')
- Models:
protected $connection = 'crm';
- dynamically change connection
$user = new User();
$user->setConnection('analytics');
$user->newQuery()->get();
OR
User::on('crm')->get();
- Migrations:
php artisan migrate --database=crm
in migration before up() protected $connection = 'crm';


# 10 aug 2026
https://github.com/itsgoingd/clockwork

