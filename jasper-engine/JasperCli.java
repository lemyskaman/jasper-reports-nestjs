import net.sf.jasperreports.engine.*;
import java.io.File;
import java.util.HashMap;

public class JasperCli {
    public static void main(String[] args) throws Exception {
        if (args.length < 2) {
            System.err.println("Usage: java JasperCli <input.jasper|jrxml> <output.pdf> [param1=value1 ...]");
            System.exit(1);
        }
        String input = args[0];
        String output = args[1];
        HashMap<String, Object> params = new HashMap<>();
        for (int i = 2; i < args.length; i++) {
            String[] kv = args[i].split("=", 2);
            if (kv.length == 2) params.put(kv[0], kv[1]);
        }
        JasperPrint jasperPrint;
        if (input.endsWith(".jrxml")) {
            JasperReport report = JasperCompileManager.compileReport(input);
            jasperPrint = JasperFillManager.fillReport(report, params, new JREmptyDataSource());
        } else {
            jasperPrint = JasperFillManager.fillReport(input, params, new JREmptyDataSource());
        }
        JasperExportManager.exportReportToPdfFile(jasperPrint, output);
        System.out.println("PDF generated: " + output);
    }
}
