import csv
with open('api/logs/querylog.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    columns=['pid','query','src','wordcount','lang','metrics','ip','sent','date']
    filewriter.writerow(columns)
    csvfile.close()
with open('api/logs/responselog.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    columns=['pid','time','errors']
    filewriter.writerow(columns)
    csvfile.close()