// Java code for thread creation by extending
// the Thread class
class addition extends Thread {
    public void run() {
        try {
            // Displaying the thread that is running
            System.out.println("hello");

        } catch (Exception e) {
            // Throwing an exception
            System.out.println("Exception is caught");
        }
    }
}

// Main Class
public class Multithread {
    public static void main(String[] args) {
        int n = 8; // Number of threads

        addition object = new addition();
        object.start();

    }
}
