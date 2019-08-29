import csv
with open('api/querylog.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    columns=['pid','query', 'wordcount','lang','metrics','ip','date']
    filewriter.writerow(columns)
    csvfile.close()
with open('api/responselog.csv', 'w') as csvfile:
    filewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)
    columns=['pid','time','errors']
    filewriter.writerow(columns)
    csvfile.close()