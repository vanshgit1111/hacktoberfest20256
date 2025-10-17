//check collision detection 
import java.util.Scanner;

public class collision {

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        System.out.print("Enter the length of rectangle: ");
        int length = sc.nextInt();
        System.out.print("Enter the breadth of rectangle: ");
        int breadth = sc.nextInt();
        System.out.println("Enter bottom left x and y position of first rectangle: ");
        int x1 = sc.nextInt();
        int y1 = sc.nextInt();
        System.out.println("Enter bottom left x and y position of second rectangle: ");
        int x2 = sc.nextInt();
        int y2 = sc.nextInt();

        int bottomLeftX1 = x1;
        int bottomLeftY1 = y1;
        int topRightX1 = x1 + length;
        int topRightY1 = y1 + breadth;

        int bottomLeftX2 = x2;
        int bottomLeftY2 = y2;
        int topRightX2 = x2 + length;
        int topRightY2 = y2 + breadth;

        if (bottomLeftX1 < topRightX2 && topRightX1 > bottomLeftX2 &&
            bottomLeftY1 < topRightY2 && topRightY1 > bottomLeftY2) {
            System.out.println("Rectangles collide!");
        } else {
            System.out.println("Rectangles do not collide.");
        }
        sc.close();
    }
}