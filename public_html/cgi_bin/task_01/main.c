#include <sys/types.h>
#include <sys/resource.h>
#include <sys/time.h>
#include <unistd.h>
#include <ulimit.h>
#include <stdlib.h>
#include <stdio.h>
 extern char **environ;
// extern char **variables;

void re_and_eff_ID ()
{
    printf("Real UserID       : %ld\n", getuid());
    printf("Effective UserID  : %ld\n", geteuid());
    printf("Real GroupID      : %ld\n", getgid());
    printf("Effective GroupID : %ld\n", getegid());
}

void proc_ID ()
{
    printf("Process number        : %ld\n", getpid());
    printf("Parent process number : %ld\n", getppid());
    printf("Group process number  : %ld\n", getpgid(0));
    return;
}

void set_core_size( char* arg)
{
    struct rlimit rlp;    
    getrlimit(RLIMIT_CORE, &rlp);
    rlp.rlim_cur = atol(arg);
    if (setrlimit(RLIMIT_CORE, &rlp) == -1)
	fprintf(stderr, "Error in changing of size of core-file\n");
    return;
}

void print_env()
{
//    char **p;
//    printf("\nEnvironment variables:\n");
//    for (p = environ; *p ; p++)
//        printf("%s\n", *p);
    system( "./pset" );
}

int help()
{
    printf("\tUsing:\tatrproc -[ispucdv] -[UCV] [parameters]\n");
    printf("-i            - real and effective ID of user and group\n");
    printf("-s            - process become leader of group\n");
    printf("-p            - print ID of process\n");
    printf("-u            - print value of ulimit\n");
    printf("-Unew_limit   - change ulimit\n");
    printf("-c            - size of core-file\n");
    printf("-Csize        - change size of core-file\n");
    printf("-d            - print current dir\n");
    printf("-v            - print enviroment variables and their values\n");
    printf("-Vname=value  - include new variable in enviroment or change its value\n");
    return 0;
}

int main(int argc, char *argv[])
{
    int ch;
    char opts[] = "ispuU:cC:dvV:";  
    struct rlimit rlp;
    long nn;
    
    if(argc==1)
    	return help();

    while ((ch = getopt(argc,argv,opts))!=EOF)
        switch (ch)
	{
	    case 'i':
		re_and_eff_ID();
    		break;
	    case 's':
        	setpgid(0,0);
    		break;
    	    case 'p':
		proc_ID();
    		break;
    	    case 'u':
    	        printf("ulimit = %ld\n", ulimit(1));
        	break;
	    case 'U':
		nn=atol(optarg);
		ulimit(2, nn);
        	if(ulimit(1)!= nn)
    		    printf("Error, you can't change ulimit!\n");
    		break;
	    case 'c':
    		getrlimit(RLIMIT_CORE, &rlp);
    		printf("Core size = %ld\n", rlp.rlim_cur);
    		break;
	    case 'C':
    		set_core_size(optarg);
    		break;
    	    case 'd':
        	printf("Current work directory is: %s\n", getcwd(0,255));
    	        break;
	    case 'v':
		print_env();
        	break;
    	    case 'V':
        	putenv(optarg);
    		break;
	}
    return 0;
}